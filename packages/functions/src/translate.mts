import { ContextMenuCommandBuilder, EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import * as tools from "@riskybot/tools";
import type { Config, EnvEnabled } from "@riskybot/tools";
// @ts-expect-error The function has no types :(
import { default as translateFunc, languages } from "translatte";
import { ApplicationCommandType } from "discord-api-types/v10";


//TODO: Make sure everything works...


export default async function translate(config: Config, input: string, to: string, from?: string) {
    to = to.replace("en-US", "en");
    to = to.replace("en-GB", "en");

    /** @type Object */
    let ans = await translateFunc((input), { to: to, from: from });
    let translated = await ans.text;

    const exampleEmbed = new EmbedBuilder()
        .setColor(config.getColors().ok)
        .setTitle("Translate")
        .setURL(tools.trim(`https://translate.google.com?sl=${await ans.from.language.iso??"en"}&tl=${to??"en"}&text=${encodeURIComponent(input)}`, 1024))
        .setAuthor({
            name: "google translate (via: github/translatte)",
            url: "https://github.com/extensionsapp/translatte/"
        })
        .addFields([{name: await languages[await ans.from.language.iso], value: tools.trim(await input, 1024), inline: true}])
        .addFields([{name: await languages[to], value: tools.trim(await translated, 1024), inline: true}]);

    return { embeds: [exampleEmbed] };
}

export function applicationCommands(config: Config, envEnabledList?:EnvEnabled) {
    config; envEnabledList; // Just so it is used
    if (config.apiEnabled.googletranslate){
        let translateSlashCommand = new SlashCommandBuilder()
            .setName("translate")
            .setDescription("Uses google translate")
            .addStringOption(
                new SlashCommandStringOption()
                    .setName("to")
                    .setDescription("The language that the text is going to be translated")
                    .setRequired(true)
                    .setChoices(
                        {name: "English", value: "en"},
                        {name: "Chinese (Simplified)", value: "zh-cn"},
                        {name: "French", value: "fr"},
                        {name: "Korean", value: "ko"},
                        {name: "Japanese", value: "ja"},
                        {name: "Hindi", value: "hi"},
                        {name: "Spanish (espanol)", value: "es"},
                        {name: "Russian", value: "ru"}
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
                        {name: "English", value: "en"},
                        {name: "Chinese (Simplified)", value: "zh-cn"},
                        {name: "French", value: "fr"},
                        {name: "Korean", value: "ko"},
                        {name: "Japanese", value: "ja"},
                        {name: "Hindi", value: "hi"},
                        {name: "Spanish (espanol)", value: "es"},
                        {name: "Russian", value: "ru"}
                    )
            );      
            let translateMessageMenu = new ContextMenuCommandBuilder()
                .setName("Translate message")
                .setType(ApplicationCommandType.Message);

        return [translateSlashCommand, translateMessageMenu];
    }
    return [];
}