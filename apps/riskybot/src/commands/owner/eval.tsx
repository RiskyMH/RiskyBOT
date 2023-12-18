// @jsxImportSource @riskybot/builders
import Command from "@riskybot/command";
import type { ApplicationCommandInteraction, ModalSubmitInteraction } from "discord-api-parser";
import { env } from "#env.ts";
import config from "#config.ts";
import { codeBlock, trim } from "@riskybot/tools";
import { ActionRow, ApplicationCommand, Embed, EmbedField, EmbedFooter, TextInputModal } from "@lilybird/jsx";
import { TextInputStyle } from "lilybird";


export default class Eval extends Command {
    override name = "eval";
    override description = "Eval is Evil.";
    override ownerOnly = true;
    override namePrefix = "eval";

    override command = (
        <ApplicationCommand name={this.name} description={this.description} />
    );

    override async handleApplicationCommand(interaction: ApplicationCommandInteraction) {
        if (!env.OWNER_USER_ID.includes(interaction.user.id)) {
            const embed = (
                <Embed
                    title="You are to Evil for Eval"
                    description="You don't have the privilege to be eval"
                    color={config.colors.error}
                />
            );

            return void interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const modal = (
            <ActionRow>
                <TextInputModal
                    id="code"
                    style={TextInputStyle.Paragraph}
                    label="Code"
                    placeholder="Code to evaluate"
                />
            </ActionRow>
        );

        await interaction.showModal({
            custom_id: "eval",
            title: "Eval",
            components: [modal]
        });
    }

    override async handleModalSubmit(interaction: ModalSubmitInteraction) {
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

        const embedMax = 1024 - codeBlock("js","").length;

        const evalResultEmbed = (
            <Embed title="Eval" color={hasError ? config.colors.error : config.colors.ok} description={hasError ? "ERROR" : undefined}>
                <EmbedFooter text="Eval is Evil" />
                <EmbedField name="Input" value={codeBlock("js", trim(input, embedMax))} />
                <EmbedField name="Result" value={codeBlock("js", trim(evalResult ? String(evalResult) : "Nothing was returned...", embedMax))} />
            </Embed>
        );

        await interaction.reply({ embeds: [evalResultEmbed] });

    }

}
