import type { ModalActionRowComponentBuilder } from "@discordjs/builders";
import { ActionRowBuilder, EmbedBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder } from "@discordjs/builders";
import { codeBlock } from "@discordjs/formatters";
import type { Config } from "@riskybot/tools";
import { EnvEnabled, trim } from "@riskybot/tools";
import { TextInputStyle } from "discord-api-types/v10";


//TODO: Make sure everything works...


export async function evalShowModal(): Promise<ModalBuilder> {

    const modal = new ModalBuilder()
        .setCustomId("eval")
        .setTitle("Eval")
        .addComponents([new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([new TextInputBuilder().setStyle(TextInputStyle.Paragraph).setLabel("Code").setPlaceholder("Code to evaluate").setCustomId("code")])]);
    return modal;
}


export async function evalResult(config: Config, input: string, evalResult: unknown, error = false) {

    const evalResultEmbed = new EmbedBuilder()
        .setTitle("Eval")
        .setColor(config.getColors().ok)
        .setFooter({ text: "Eval is Evil" })
        .addFields([{
            name: "Input",
            value: trim(codeBlock("js", input), 1024)
        }])
        .addFields([{
            name: "Result",
            value: trim(codeBlock("js", evalResult ? String(evalResult) : "Nothing was returned..."), 1024)
        }]);

    if (error) {
        evalResultEmbed
            .setColor(config.getColors().error)
            .setDescription("ERROR");
    }

    return { embeds: [evalResultEmbed] };
}

export function applicationCommands(config?: Config, envEnabledList?: EnvEnabled) {
    // eslint-disable-next-line no-unused-expressions
    config; envEnabledList; // Just so it is used

    const evalSlashCommand = new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Eval is Evil.");
        
    return [evalSlashCommand];
}