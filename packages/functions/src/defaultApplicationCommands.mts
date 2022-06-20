export {applicationCommands as about} from "./about.mjs";
export {applicationCommands as deepai} from "./deepai.mjs";
export {applicationCommands as fun} from "./fun.mjs";
export {applicationCommands as meCredits} from "./me+credits.mjs";
export {applicationCommands as ownerCmds} from "./ownerCmds.mjs";
export {applicationCommands as random} from "./random.mjs";
export {applicationCommands as reddit} from "./reddit.mjs";
export {applicationCommands as say} from "./say.mjs";
export {applicationCommands as search} from "./search.mjs";
export {applicationCommands as toolsCmd} from "./toolsCmd.mjs";
export {applicationCommands as translate} from "./translate.mjs";

// mini's commands
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import type { Config, EnvEnabled } from "@riskybot/tools";

export function ping(config?: Config, envEnabledList?: EnvEnabled) {
    config; envEnabledList; // Just so it is used

    let pingSlashCommand = new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong!");
        return [pingSlashCommand];
}
export function message(config?: Config, envEnabledList?: EnvEnabled) {
    config; envEnabledList; // Just so it is used

    let messageSlashCommand = new SlashCommandBuilder()
        .setName("message")
        .setDescription("Uses the bot to DM yourself")
        .addStringOption(
            new SlashCommandStringOption()
                .setName("message")
                .setDescription("Enter a message")
                .setRequired(true)
        );
        return [messageSlashCommand];
}