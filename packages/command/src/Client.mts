import { glob } from "glob";
import Command from "./Command.mjs";
import path from "node:path";
import handleInteraction from "./handle.mjs";
import { Interaction } from "discord-api-parser";
import { RESTPostAPIWebhookWithTokenJSONBody, RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { deployCommands, trim } from "@riskybot/tools";
import RiskyBotError from "@riskybot/error";
import { EmbedBuilder } from "@discordjs/builders";
import { fetch } from "undici";


export default class Client {
    dir: string;

    commands: Command[] = [];

    constructor(dir: string) {
        this.dir = dir.replaceAll("\\", "/");
    }

    async getCommands() {
        const folder = path.join(this.dir, "/commands/**/*.mjs")
            .replaceAll("\\", "/");

        const files = glob.sync(folder);

        await Promise.all(files.map(async file => {
            const location = file
                .replace("C:\\", "/")
                .replaceAll("\\", "/");

            if (/^(?:.*[\\/])?_[^\\/]*$/.test(location) || location.endsWith("/index.mjs")) return;

            // eslint-disable-next-line unicorn/no-await-expression-member
            const command = new (await import(location)).default();
            this.commands.push(command);
        }));

    }

    async handleInteraction(interaction: Interaction) {
        if (this.commands.length === 0) {
            throw new Error("No commands");
        }

        try {
            return await handleInteraction(interaction, this.commands);
        } catch (error) {

            console.error(error);

            const errorColor = 0xED_42_45;

            const embed = new EmbedBuilder()
                .setColor(errorColor);

            let webhookError = {} as RESTPostAPIWebhookWithTokenJSONBody;

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

                const wbDesc = error.logError.more
                    ? `${error.logError.message}\n\n\`\`\`${trim(error.logError.more, 1028)}\`\`\``
                    : error.logError.message;

                webhookError = {
                    embeds: [
                        {
                            title: error.logError.title,
                            description: wbDesc,
                            color: errorColor
                        }
                    ]

                };


            } else {
                embed
                    .setTitle("Unknown error")
                    .setDescription("An unknown error occurred (you somehow broke the bot)");
            }

            // https://discord.com/api/webhooks/id/token
            const url = process.env.ERROR_WEBHOOK;
            if (url) {

                fetch(url, {
                    body: JSON.stringify(webhookError),
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }

                });

            }

            // Replyable interactions
            if (interaction.isApplicationCommand() || interaction.isMessageComponent() || interaction.isModalSubmit()) {
                return interaction.reply({ embeds: [embed], ephemeral: true });
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
