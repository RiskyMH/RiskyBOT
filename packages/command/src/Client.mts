import { glob } from "glob";
import Command from "./Command.mjs";
import path from "path";
import handleInteraction from "./handle.mjs";
import { Interaction } from "discord-api-parser";
import { RESTPostAPIWebhookWithTokenJSONBody, RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { deployCommands } from "@riskybot/tools";
import RiskyBotError from "@riskybot/error";
import { EmbedBuilder } from "@discordjs/builders";
import { fetch } from "undici";
import addCommandToWebsite from "./add-command-to-website.mjs";


export default class Client {
    dir: string;

    commands: Command[] = [];

    constructor(dir: string) {
        this.dir = dir.replace(/\\/g, "/");
    }

    async getCommands() {
        const folder = path.join(this.dir, "/commands/**/*.mjs")
            .replace(/\\/g, "/");

        const files = glob.sync(folder);

        await Promise.all(files.map(async file => {
            const location = file
                // .replace(this.dir, ".")
                .replace("C:\\", "/")
                .replaceAll("\\", "/");

            if (/^(?:.*[\\/])?_[^\\/]*$/.test(location) || location.endsWith("/index.mjs")) return;

            const command = new (await import(location)).default();
            this.commands.push(command);
        }));

    }

    async handleInteraction(interaction: Interaction) {
        if (!this.commands.length) {
            throw new Error("No commands");
        }
        try {
            return await handleInteraction(interaction, this.commands);
        } catch (error) {

            const errorColor = 0xED4245;

            const embed = new EmbedBuilder()
                .setColor(errorColor);

            if (error instanceof RiskyBotError) {
                embed
                    .setTitle(error.error.title)
                    .setDescription(error.error.message);

                if (error.error.author) {
                    embed
                        .setAuthor({
                            name: error.error.author.name,
                            iconURL: error.error.author.image,
                            url: error.error.author.url,
                        });
                }

                // Replyable interactions
                if (interaction.isApplicationCommand() || interaction.isMessageComponent() || interaction.isModalSubmit()) {
                    return interaction.reply({ embeds: [embed] });
                }

                // https://discord.com/api/webhooks/id/token
                const url = process.env.ERROR_WEBHOOK;
                if (url) {
                    await fetch(url, {
                        body: JSON.stringify({
                            content: "hello",
                            embeds: [
                                {
                                    title: error.logError.title,
                                    description: error.logError.message,
                                    color: errorColor
                                }
                            ]

                        } as RESTPostAPIWebhookWithTokenJSONBody),
                        method: "POST"
                    });

                }


            }


        }
    }

    getAPICommands(ownerOnly = false) {
        const APICommands: RESTPostAPIApplicationCommandsJSONBody[] = [];

        for (const command of this.commands) {

            if (command.ownerOnly && !ownerOnly) continue;
            if (!command.ownerOnly && ownerOnly) continue;

            if (command.command) {
                APICommands.push(command.command.toJSON());
            }

            if (command.userCommand) {
                APICommands.push(command.userCommand.toJSON());
            }

            if (command.messageCommand) {
                APICommands.push(command.messageCommand.toJSON());
            }
        }
        return APICommands;
    }

    async deployCommands({ applicationId, clientSecret, guildId }: {
        applicationId: string;
        clientSecret: string;
        guildId?: string;
    }) {

        addCommandToWebsite(this.getAPICommands(), this.dir);

        await deployCommands({
            applicationId,
            clientSecret,
            commands: this.getAPICommands(),
        });

        if (guildId) {
            console.info("Deploying guild commands");

            await deployCommands({
                applicationId,
                clientSecret,
                guildId,
                commands: this.getAPICommands(true)
            });
        }
        console.info("Deployed commands");
    }

}
