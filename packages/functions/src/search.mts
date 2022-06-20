import type { ApplicationCommandOptionChoiceData, InteractionReplyOptions } from "discord.js";
import { inlineCode, italic, EmbedBuilder, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { trim } from "@riskybot/tools";
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

                const linkRegex = /\[([\S\s][^\]]*)\]/g;
                let newDef = urbanChosen.definition;
                let array1;
                while ((array1 = linkRegex.exec(urbanChosen.definition)) !== null) {
                    let term = array1[0].replace("[", "").replace("]", "");
                    newDef = newDef.replace(array1[0], `[${term}](https://www.urbandictionary.com/define.php?term=${encodeURI(term)})`);
                }
                let newExam = urbanChosen.example;
                while ((array1 = linkRegex.exec(urbanChosen.example)) !== null) {
                    let term = array1[0].replace("[", "").replace("]", "");
                    newExam = newExam.replace(array1[0], `[${term}](https://www.urbandictionary.com/define.php?term=${encodeURI(term)})`);
                }

                searEmb
                    .setAuthor({name: "Urban Dictionary", url: "https://www.urbandictionary.com/", iconURL: "https://www.urbandictionary.com/apple-touch-icon.png"})
                    .setTitle("Urban Dictionary result for " + inlineCode(trim(urbanChosen.word, 15)))
                    .setURL(urbanChosen.permalink)
                    .addFields([{name: "Definition", value: trim(newDef, 1024)}])
                    .addFields([{name: "Example", value: italic(trim(newExam, 1024-2))}])
                    .addFields([{name: "Stats", value: `\`👍${urbanChosen.thumbs_up}\` \`👎${urbanChosen.thumbs_down}\``}])
                    .setTimestamp(urbanChosen.written_on)
                    .setFooter({text: "Defined by: " + urbanChosen.author});
            } else {
                if (urbanDef === null) errorEmb.setDescription(trim("No results found for " + inlineCode(input), 4096));
                else if (urbanDef === undefined) errorEmb.setDescription("An error occurred while using the [`Urban Dictionary`](https://urbandictionary.com) API");

                return { embeds: [errorEmb], ephemeral: true };
            }
        }
        break;

        case "lyrics": {
            let lyrics = await someRandomApi.getLyrics(input);
            if (lyrics && lyrics.lyrics) {
                searEmb
                    .setThumbnail(lyrics.thumbnail?.genius??"")
                    .setURL(lyrics.links?.genius??"")
                    .setDescription(trim(lyrics.lyrics, 4096 ))
                    .setTitle("Lyrics for " + inlineCode(trim(lyrics.title + " ("+lyrics.author+")", 25)))
                    .setFooter({text: "Powered using https://some-random-api.ml"});
                if (lyrics.links?.genius) searEmb.setAuthor({name: "Genius", url: "https://genius.com", iconURL: "https://genius.com/apple-touch-icon.png"});

            } else {
                if (lyrics === null) errorEmb.setDescription(trim("No results found for " + inlineCode(input), 4096));
                else if (lyrics === undefined) errorEmb.setDescription("There was an error while using the [Some Random Api](https://some-random-api.ml) API");
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


export function applicationCommands(config?: Config, envEnabledList?: EnvEnabled) {
    config; envEnabledList; // Just so it is used
    if (config?.apiEnabled.someRandomApi || config?.apiEnabled.urbanDictionary) {
        let searchSlashCommand = new SlashCommandBuilder()
            .setName("search")
            .setDescription("🔍 Use the bot to search from sources");
            
        if (config?.apiEnabled.urbanDictionary) {
            searchSlashCommand.addSubcommand( 
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
            );
        }
        if (config?.apiEnabled.someRandomApi) {
            searchSlashCommand.addSubcommand( 
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
        }
        return [searchSlashCommand];
    }
    return [];
}