import { ActionRowBuilder, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, codeBlock } from "@discordjs/builders";
import Command from "@riskybot/command";
import { ApplicationCommandInteraction, ModalSubmitInteraction } from "discord-api-parser";
import { env } from "#env.mjs";
import config from "#config.mjs";
import { TextInputStyle } from "discord-api-types/v10";
import { trim } from "@riskybot/tools";


export default class Eval extends Command {
    name = "eval";
    description = "Eval is Evil.";
    ownerOnly = true;
    namePrefix = "eval";

    command = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description);

    async handleApplicationCommand(interaction: ApplicationCommandInteraction) {
        if (!env.OWNER_USER_ID.includes(interaction.user.id)) {
            const embed = new EmbedBuilder()
                .setTitle("You are to Evil for Eval")
                .setDescription("You don't have the privilege to be eval")
                .setColor(config.colors.error);

            return void interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const modal = new ModalBuilder()
            .setCustomId("eval")
            .setTitle("Eval")
            .addComponents([
                new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([
                    new TextInputBuilder()
                        .setStyle(TextInputStyle.Paragraph)
                        .setLabel("Code")
                        .setPlaceholder("Code to evaluate")
                        .setCustomId("code")
                ])
            ]);

        await interaction.showModal(modal);
    }

    async handleModalSubmit(interaction: ModalSubmitInteraction) {
        if (!env.OWNER_USER_ID.includes(interaction.user.id)) {
            throw new Error("You are to Evil for Eval");
        }

        const input = interaction.fields.getTextInputValue("code", true);

        let hasError = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let evalResult: any = null;

        try {
            evalResult = await eval(input);
        } catch (error) {
            evalResult = error;
            hasError = true;
            console.error("EVAL RESULT ERROR BELOW:\n", error);
        }

        const evalResultEmbed = new EmbedBuilder()
            .setTitle("Eval")
            .setColor(config.colors.ok)
            .setFooter({ text: "Eval is Evil" })
            .addFields([{
                name: "Input",
                value: trim(codeBlock("js", input), 1024)
            }])
            .addFields([{
                name: "Result",
                value: trim(codeBlock("js", evalResult ? String(evalResult) : "Nothing was returned..."), 1024)
            }]);

        if (hasError) {
            evalResultEmbed
                .setColor(config.colors.error)
                .setDescription("ERROR");
        }

        await interaction.reply({ embeds: [evalResultEmbed] });

    }

}
