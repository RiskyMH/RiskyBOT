// @jsxImportSource @riskybot/builders
import config from "#config.ts";
import Command from "@riskybot/command";
import { trim } from "@riskybot/tools";
import type { ApplicationCommandInteraction } from "discord-api-parser";
import { googleTranslate } from "@riskybot/apis";
import { ApplicationCommand, CommandOptions, StringOption, Embed, EmbedAuthor, EmbedField } from "@lilybird/jsx";
import { ApplicationCommandType } from "lilybird";


export default class Translate extends Command {
    override name = "translate";
    override description = "Translate text between language using Google Translate";

    override  command = (
        <ApplicationCommand name={this.name} description={this.description}>
            <StringOption
                name="input"
                description="The input for the translator"
                required
            />
            <StringOption
                name="language"
                description="The language that the text is going to be translated"
                required
            >
                <CommandOptions name="English" value="en" />
                <CommandOptions name="Chinese (Simplified)" value="zh-cn" />
                <CommandOptions name="French" value="fr" />
                <CommandOptions name="Korean" value="ko" />
                <CommandOptions name="Japanese" value="ja" />
                <CommandOptions name="Hindi" value="hi" />
                <CommandOptions name="Spanish (espanol)" value="es" />
                <CommandOptions name="Russian" value="ru" />
            </StringOption>
        </ApplicationCommand>
    );

    override aliases = ["Translate message"];
    override messageCommand = {
        name: "Translate message",
        type: ApplicationCommandType.MESSAGE,
    };

    override async handleApplicationCommand(interaction: ApplicationCommandInteraction) {

        const content = interaction.isChatInputCommand()
            ? interaction.options.getString("input", true)
            : interaction.isMessageCommand()
                ? interaction.targetMessage.content
                : null;

        if (!content) {
            const embed = (
                <Embed
                    color={config.colors.error}
                    title="No content to translate"
                    description="You must provide some content to translate"
                />
            );

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const to = (interaction.isChatInputCommand() && interaction.options.getString("language", true))
            || (interaction.locale.replaceAll(/en-(US|GB)/g, "en"));

        const from = "auto";

        const { translatedText: translation, language: detectedLanguage } = await googleTranslate.translate(content, to, from);


        const embed = (
            <Embed
                color={config.colors.ok}
                title="Translate"
                url={trim("https://translate.google.com?" + new URLSearchParams({ sl: detectedLanguage, tl: to, text: content }), 1024)}
            >
                <EmbedAuthor name="Google Translate" url="https://translate.google.com" icon_url="https://www.gstatic.com/images/branding/product/1x/translate_64dp.png" />
                <EmbedField name={googleTranslate.langs[detectedLanguage]} value={trim(content, 1024)} inline />
                <EmbedField name={googleTranslate.langs[to]} value={trim(translation, 1024)} inline />
            </Embed>
        );

        await interaction.reply({ embeds: [embed] });

    }

}

