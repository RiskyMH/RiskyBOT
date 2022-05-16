import { ApplicationCommandType } from "discord-api-types/v10";
import type { ApplicationCommandOptionChoiceData, InteractionReplyOptions } from "discord.js";
import { inlineCode, italic, EmbedBuilder, SlashCommandBuilder, SlashCommandSubcommandBuilder, ContextMenuCommandBuilder } from "@discordjs/builders";
import * as tools from "@riskybot/tools";
import type { Config, EnvEnabled } from "@riskybot/tools";
import { urbanDictionary, someRandomApi } from "@riskybot/apis";
import { SlashCommandStringOption } from "@discordjs/builders";


//TODO: Make sure everything works...


export default async function search(config: Config, engine: string, input: string): Promise<InteractionReplyOptions> {
    let searEmb = new EmbedBuilder().setTitle("Fun").setColor(config.getColors().ok);
    let errorEmb = new EmbedBuilder().setTitle("Errors - search").setColor(config.getColors().error);

    switch (engine) {
        case "urban-dictionary": {
            let urbanDef = await urbanDictionary.define(input);
            
            if (urbanDef && urbanDef.length) {
                let urbanChosen = urbanDef[0];

                const regex1 = /\[([\S\s][^\]]*)\]/g;
                let newDef = urbanChosen.definition;
                let array1;
                while ((array1 = regex1.exec(urbanChosen.definition)) !== null) {
                    let term = array1[0].replace("[", "").replace("]", "");
                    newDef = newDef.replace(array1[0], `[${term}](https://www.urbandictionary.com/define.php?term=${encodeURI(term)})`);
                }
                let newExam = urbanChosen.example;
                while ((array1 = regex1.exec(urbanChosen.example)) !== null) {
                    let term = array1[0].replace("[", "").replace("]", "");
                    newExam = newExam.replace(array1[0], `[${term}](https://www.urbandictionary.com/define.php?term=${encodeURI(term)})`);
                }

                searEmb
                    .setAuthor({name: "Urban Dictionary", url: "https://www.urbandictionary.com/", iconURL: "https://www.urbandictionary.com/apple-touch-icon.png"})
                    .setTitle("Urban Dictionary result for " + inlineCode(tools.trim(urbanChosen.word, 15)))
                    .setURL(urbanChosen.permalink)
                    .addFields([{name: "Definition", value: tools.trim(newDef, 1024)}])
                    .addFields([{name: "Example", value: italic(tools.trim(newExam, 1024-2))}])
                    .addFields([{name: "Stats", value: `\`👍${urbanChosen.thumbs_up}\` \`👎${urbanChosen.thumbs_down}\``}])
                    .setTimestamp(urbanChosen.written_on)
                    .setFooter({text: "Defined by: " + urbanChosen.author});
            } else {
                errorEmb.setDescription("no findings :(");
                return { embeds: [errorEmb], ephemeral: true };
            }
        }
        break;

        case "lyrics": {
            let lyrics = await someRandomApi.getLyrics(input);
            if (lyrics && lyrics.lyrics) {
                searEmb
                    .setThumbnail(lyrics.thumbnail?.genius??"")
                    .setAuthor({ name: "Some Random Api", url: "https://some-random-api.ml", iconURL: "https://i.some-random-api.ml/logo.png" })
                    .setURL(lyrics.links?.genius??"")
                    .setDescription(tools.trim(lyrics.lyrics, 4096 ))
                    .setTitle("Lyrics for " + inlineCode(tools.trim(lyrics.title + " ("+lyrics.author+")", 25)));
                if (lyrics.links?.genius) searEmb.setFooter({text: "Powered by Genius"});

            } else {
                errorEmb.setDescription("no findings :(");
                return { embeds: [errorEmb], ephemeral: true };
            }
        }

    }
    return { embeds: [searEmb] };
}


export async function autoComplete(engine: string, input: string): Promise<ApplicationCommandOptionChoiceData[]> {

    switch (engine) {
        case "urban-dictionary": {
            let complete = await urbanDictionary.autoComplete(input);

            if (!complete || !complete.length) return [];

            let wordList = complete.map((word: string) => ({ name: word, value: word })).slice(0, 25);

            if ((wordList[0].name.toLowerCase() !== input.toLowerCase())) {
                wordList.unshift({ name: input, value: input });
            }

            return wordList;
        }

    }
    return [];

}


export function applicationCommands(config: Config, envEnabledList?:EnvEnabled) {
    config; envEnabledList; // Just so it is used
    let searchSlashCommand = new SlashCommandBuilder()
        .setName("search")
        .setDescription("🔍 Use the bot to search from sources")
        .addSubcommand( 
            new SlashCommandSubcommandBuilder()
                .setName("urban-dictionary")
                .setDescription("Use Urban Dictionary to define")
                .addStringOption(
            new SlashCommandStringOption()
                        .setName("input")
                        .setDescription("The input for the search engine")
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        ).addSubcommand( 
            new SlashCommandSubcommandBuilder()
                .setName("lyrics")
                .setDescription("Use Lyrics to search for lyrics")
                .addStringOption(
            new SlashCommandStringOption()
                        .setName("song-name")
                        .setDescription("The song name to find lyrics for")
                        .setRequired(true)
                )
        );
    let menu = new ContextMenuCommandBuilder()
        .setName("search")
        .setType(ApplicationCommandType.User);
    return [searchSlashCommand, menu];
}