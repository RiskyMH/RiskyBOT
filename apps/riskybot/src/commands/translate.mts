import config from "#config.mjs";
import { ContextMenuCommandBuilder, EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import Command from "@riskybot/command";
import { trim } from "@riskybot/tools";
import { ApplicationCommandInteraction } from "discord-api-parser";
import { ApplicationCommandType } from "discord-api-types/v10";
import { fetch } from "undici";


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
            || (interaction.locale.replace(/en-(US|GB)/g, "en"));

        const from = "auto";

        // TODO: Convert to @riskybot/apis (and add error handling)
        const [[translation, detectedLanguage]] = await (await fetch(`https://translate.google.com/translate_a/t?client=dict-chrome-ex&${new URLSearchParams({ sl: from, tl: to, q: content })}`)).json() as [[string, string]];

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
                name: langs[detectedLanguage],
                value: trim(content, 1024), inline: true
            }])
            .addFields([{
                name: langs[to],
                value: trim(translation, 1024), inline: true
            }]);

        await interaction.reply({ embeds: [embed] });

    }

}

/**
 *
 * Generated from https://translate.google.com
 *
 * The languages that Google Translate supports (as of 5/15/16) alongside with their ISO 639-1 codes
 * See https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 */
const langs: Record<string, string> = {
    "auto": "Automatic",
    "af": "Afrikaans",
    "sq": "Albanian",
    "am": "Amharic",
    "ar": "Arabic",
    "hy": "Armenian",
    "az": "Azerbaijani",
    "eu": "Basque",
    "be": "Belarusian",
    "bn": "Bengali",
    "bs": "Bosnian",
    "bg": "Bulgarian",
    "ca": "Catalan",
    "ceb": "Cebuano",
    "ny": "Chichewa",
    "zh": "Chinese (Simplified)",
    "zh-cn": "Chinese (Simplified)",
    "zh-tw": "Chinese (Traditional)",
    "co": "Corsican",
    "hr": "Croatian",
    "cs": "Czech",
    "da": "Danish",
    "nl": "Dutch",
    "en": "English",
    "eo": "Esperanto",
    "et": "Estonian",
    "tl": "Filipino",
    "fi": "Finnish",
    "fr": "French",
    "fy": "Frisian",
    "gl": "Galician",
    "ka": "Georgian",
    "de": "German",
    "el": "Greek",
    "gu": "Gujarati",
    "ht": "Haitian Creole",
    "ha": "Hausa",
    "haw": "Hawaiian",
    "he": "Hebrew",
    "iw": "Hebrew",
    "hi": "Hindi",
    "hmn": "Hmong",
    "hu": "Hungarian",
    "is": "Icelandic",
    "ig": "Igbo",
    "id": "Indonesian",
    "ga": "Irish",
    "it": "Italian",
    "ja": "Japanese",
    "jw": "Javanese",
    "kn": "Kannada",
    "kk": "Kazakh",
    "km": "Khmer",
    "ko": "Korean",
    "ku": "Kurdish (Kurmanji)",
    "ky": "Kyrgyz",
    "lo": "Lao",
    "la": "Latin",
    "lv": "Latvian",
    "lt": "Lithuanian",
    "lb": "Luxembourgish",
    "mk": "Macedonian",
    "mg": "Malagasy",
    "ms": "Malay",
    "ml": "Malayalam",
    "mt": "Maltese",
    "mi": "Maori",
    "mr": "Marathi",
    "mn": "Mongolian",
    "my": "Myanmar (Burmese)",
    "ne": "Nepali",
    "no": "Norwegian",
    "ps": "Pashto",
    "fa": "Persian",
    "pl": "Polish",
    "pt": "Portuguese",
    "pa": "Punjabi",
    "ro": "Romanian",
    "ru": "Russian",
    "sm": "Samoan",
    "gd": "Scots Gaelic",
    "sr": "Serbian",
    "st": "Sesotho",
    "sn": "Shona",
    "sd": "Sindhi",
    "si": "Sinhala",
    "sk": "Slovak",
    "sl": "Slovenian",
    "so": "Somali",
    "es": "Spanish",
    "su": "Sundanese",
    "sw": "Swahili",
    "sv": "Swedish",
    "tg": "Tajik",
    "ta": "Tamil",
    "te": "Telugu",
    "th": "Thai",
    "tr": "Turkish",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "uz": "Uzbek",
    "vi": "Vietnamese",
    "cy": "Welsh",
    "xh": "Xhosa",
    "yi": "Yiddish",
    "yo": "Yoruba",
    "zu": "Zulu"
};