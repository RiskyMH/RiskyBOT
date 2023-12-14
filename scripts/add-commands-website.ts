import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";
import { Client } from "@riskybot/command";

export interface WebsiteCommand {
    name: string,
    description: string,
    bot: string,
    options: {
        name: string,
        description: string,
        required?: boolean,
    }[]
}

const jsonPath = "./apps/website/assets/commands.json"

export default async function addCommandsToWebsite(bot: string) {
    const client = (await import(`../apps/${bot}/src/main.ts`)).client as Client
    const commands = client.getAPICommands();

    // remove all commands that are from riskybot
    const json = await Bun.file(jsonPath).json() as WebsiteCommand[];

    const JSONCommands = json.filter(c => c.bot !== bot);

    const botCommands = [];

    for (const command of commands) {
        if (command.type === ApplicationCommandType.ChatInput || !command.type) {
            if (command.options?.[0]?.type === ApplicationCommandOptionType.Subcommand) {
                for (const c of command.options) {
                    if (c.type === ApplicationCommandOptionType.SubcommandGroup) {
                        for (const sc of c.options || []) {
                            botCommands.push({
                                name: command.name + " " + c.name + " " + sc.name,
                                description: sc.description,
                                bot,
                                options: (sc.options || []).map(o => ({
                                    name: o.name,
                                    description: o.description,
                                    required: o.required,
                                }))
                            });
                        }
                    }

                    else if (c.type === ApplicationCommandOptionType.Subcommand) {
                        botCommands.push({
                            name: command.name + " " + c.name,
                            description: c.description,
                            bot,
                            options: (c.options || []).map(o => ({
                                name: o.name,
                                description: o.description,
                                required: o.required,
                            }))
                        });
                    }
                }
            }

            if (command.options?.[0]?.type !== ApplicationCommandOptionType.SubcommandGroup && command.options?.[0]?.type !== ApplicationCommandOptionType.Subcommand) {
                botCommands.push({
                    name: command.name,
                    description: command.description,
                    bot,
                    options: (command.options || []).map(o => ({
                        name: o.name,
                        description: o.description,
                        required: o.required,
                    }))
                });
            }

        }

    }

    const cmds = [
        ...JSONCommands,
        ...botCommands
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(command => ({ 
                ...command, 
                name: command.name.replace("-aboutme-credits-", "aboutme-credits") 
            })), // fix aboutme-credits
    ];

    // save it 
    const data = JSON.stringify(cmds, null, 2);
    Bun.write(jsonPath, data);

}