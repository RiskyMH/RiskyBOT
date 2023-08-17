import config from "#config.mjs";
import { ContextMenuCommandBuilder, EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import Command from "@riskybot/command";
import { trim } from "@riskybot/tools";
import { ApplicationCommandInteraction } from "discord-api-parser";
import { ApplicationCommandType } from "discord-api-types/v10";
import { googleTranslate } from "@riskybot/apis";


export default class Translate extends Command {
    name = "translate";
    description = "Translate text between language using Google Translate";

    command = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption(
            new SlashCommandStringOption()
                .setName("input")
                .setDescription("The input for the translator")
                .setRequired(true)
        ).addStringOption(
            new SlashCommandStringOption()
                .setName("language")
                .setDescription("The language that the text is going to be translated")
                .setRequired(true)
                .setChoices(
                    { name: "English", value: "en" },
                    { name: "Chinese (Simplified)", value: "zh-cn" },
                    { name: "French", value: "fr" },
                    { name: "Korean", value: "ko" },
                    { name: "Japanese", value: "ja" },
                    { name: "Hindi", value: "hi" },
                    { name: "Spanish (espanol)", value: "es" },
                    { name: "Russian", value: "ru" }
                )
        );

    messageCommandName = "Translate message";
    messageCommand = new ContextMenuCommandBuilder()
        .setName(this.messageCommandName)
        .setType(ApplicationCommandType.Message);

    async handleApplicationCommand(interaction: ApplicationCommandInteraction) {

        const content = interaction.isChatInputCommand()
            ? interaction.options.getString("input", true)
            : interaction.isMessageCommand()
                ? interaction.targetMessage.content
                : null;

        if (!content) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("No content to translate")
                .setDescription("You must provide some content to translate");

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const to = (interaction.isChatInputCommand() && interaction.options.getString("language", true))
            || (interaction.locale.replaceAll(/en-(US|GB)/g, "en"));

        const from = "auto";

        const { translatedText: translation, language: detectedLanguage } = await googleTranslate.translate(content, to, from);

        const embed = new EmbedBuilder()
            .setColor(config.colors.ok)
            .setTitle("Translate")
            .setURL(trim("https://translate.google.com?" + new URLSearchParams({ sl: detectedLanguage, tl: to, text: content }), 1024))
            .setAuthor({
                name: "Google Translate",
                url: "https://translate.google.com",
                iconURL: "https://www.gstatic.com/images/branding/product/1x/translate_64dp.png"
            })
            .addFields([{
                name: googleTranslate.langs[detectedLanguage],
                value: trim(content, 1024), inline: true
            }])
            .addFields([{
                name: googleTranslate.langs[to],
                value: trim(translation, 1024), inline: true
            }]);

        await interaction.reply({ embeds: [embed] });

    }

}

