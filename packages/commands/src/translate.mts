import { ContextMenuCommandBuilder, EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import type { Config, EnvEnabled } from "@riskybot/tools";
import * as tools from "@riskybot/tools";
import { ApplicationCommandType } from "discord-api-types/v10";
// @ts-expect-error The function has no types :(
import { languages, default as translateFunc } from "translatte";


//TODO: Make sure everything works...


export default async function translate(config: Config, input: string, to: string, from?: string) {
    to = to.replace("en-US", "en");
    to = to.replace("en-GB", "en");

    const ans = await translateFunc(input, { to, from }) as Translated;

    const exampleEmbed = new EmbedBuilder()
        .setColor(config.getColors().ok)
        .setTitle("Translate")
        // .setURL(tools.trim(`https://translate.google.com?sl=${ans.from.language.iso ?? "en"}&tl=${to ?? "en"}&text=${encodeURIComponent(input)}`, 1024))
        .setURL(tools.trim("https://translate.google.com?" + new URLSearchParams({ sl: ans.from.language.iso || "auto", tl: to, text: input }), 1024))
        .setAuthor({
            name: "google translate (via: github/translatte)",
            url: "https://github.com/extensionsapp/translatte/"
        })
        .addFields([{
            name: languages[ans.from.language.iso],
            value: tools.trim(input, 1024), inline: true
        }])
        .addFields([{
            name: languages[to],
            value: tools.trim(ans.text, 1024), inline: true
        }]);

    return { embeds: [exampleEmbed] };
}

/** From: https://github.com/extensionsapp/translatte/#returns-an-object */
interface Translated {
    /** The translated text. */
    text: string
    from: {
        language: {
            /** `true` if the API suggest a correction in the source language */
            didYouMean: boolean
            /** The [code of the language](https://github.com/extensionsapp/translatte/blob/master/languages.js) that the API has recognized in the text */
            iso: string
        }
        /** 
         * @Note that `res.from.text` will only be returned if `from.text.autoCorrected` or `from.text.didYouMean` equals to true. In this case, it will have the corrections delimited with brackets (`[ ]`): 
         */
        text?: {
            /** `true` if the API has auto corrected the `text` */
            autoCorrected: boolean
            /** The auto corrected `text` or the `text` with suggested corrections */
            value: string
            /** `true` if the API has suggested corrections to the `text` */
            didYouMean: boolean
        }
    }
    /** If `options.raw` is true, the raw response from Google Translate servers. Otherwise, `''`. */
    raw: string
    /** The proxy that were used in the request. */
    proxy: string
    /** The agent that were used in the request. */
    agent: string
    /** The service that were used in the request. */
    service: string

}

export function applicationCommands(config?: Config, envEnabledList?: EnvEnabled) {
    // eslint-disable-next-line no-unused-expressions
    config; envEnabledList; // Just so it is used

    if (config?.apiEnabled.googleTranslate) {
        const translateSlashCommand = new SlashCommandBuilder()
            .setName("translate")
            .setDescription("Uses google translate")
            .addStringOption(
                new SlashCommandStringOption()
                    .setName("to")
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
            ).addStringOption(
                new SlashCommandStringOption()
                    .setName("input")
                    .setDescription("The input for the translator")
                    .setRequired(true)
            ).addStringOption(
                new SlashCommandStringOption()
                    .setName("from")
                    .setDescription("The language that the text is from")
                    .setRequired(false)
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
        const translateMessageMenu = new ContextMenuCommandBuilder()
            .setName("Translate message")
            .setType(ApplicationCommandType.Message);

        return [translateSlashCommand, translateMessageMenu];
    }
    return [];
}