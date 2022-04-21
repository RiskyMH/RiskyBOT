// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// //  @ts-nocheck

import { ApplicationCommandOptionChoice, EmbedBuilder } from "discord.js";
import type { Client } from "discord.js";
import fetch from "node-fetch";
import { inlineCode, italic } from "@discordjs/builders";
import * as tools from "@riskybot/tools";
import type { Config } from "@riskybot/tools";

const urbanBaseURL = "https://api.urbandictionary.com/v0/";


export default async function search(client: Client, config: Config, engine: string, input: string) {
    let searEmb = new EmbedBuilder().setTitle("Fun").setColor(config.getColors().ok);
    let errorEmb = new EmbedBuilder().setTitle("Errors - search").setColor(config.getColors().error);

    switch (engine) {
        case "urban-dictionary": {
            // TODO: fix types
            let urbanDef: any = await fetch(urbanBaseURL + "define?" + new URLSearchParams({ term: input })).then((response) => response.json());
            
            if (await urbanDef.list.length) {
                let urbanChosen = await urbanDef.list[0];
                searEmb
                    .addFields({name: "Definition", value: tools.trim(await urbanChosen.definition, 1024)})
                    .addFields({name: "Example", value: tools.trim(await urbanChosen.example, 1024)})
                    .addFields({name: "Stats", value: `\`👍${await urbanChosen.thumbs_up}\` \`👎${await urbanChosen.thumbs_down}\``})
                    .setAuthor({name: "Urban Dictionary", url: "https://www.urbandictionary.com/",})
                    .setURL(await urbanChosen.permalink)
                    .setTimestamp(await urbanChosen.written_on)
                    .setFooter({text: "Defined by: " + (await urbanChosen.author)})
                    .setTitle("Search - " + inlineCode(tools.trim(urbanChosen.word, 15)));
            } else {
                errorEmb.setDescription("no findings :(");
                return { embeds: [errorEmb] };
            }
        }
        break;

        case "lyrics": {
            // TODO: fix types
            let lyrics: any = await fetch("https://some-random-api.ml/" + "lyrics?" + new URLSearchParams({ title: input })).then((response) => response.json());
            if (await lyrics?.lyrics) {
                searEmb
                    .setThumbnail(await lyrics.thumbnail?.genius)
                    .setAuthor({ name: "Some Random Api", url: "https://some-random-api.ml", iconURL: "https://i.some-random-api.ml/logo.png" })
                    .setURL(await lyrics.links?.genius)
                    .setDescription(tools.trim(lyrics.lyrics, 4096 ))
                    .setTitle("Search - " + inlineCode(tools.trim(await lyrics.title + " ("+await lyrics.author+")", 25)));
                if (lyrics.links?.genius) searEmb.setFooter({text: "Powered by Genius"});

            } else {
                errorEmb.setDescription("no findings :(");
                return { embeds: [errorEmb] };
            }
        }

    }
    return { embeds: [searEmb] };
}


export async function autoComplete(client: Client, engine: string, input: string): Promise<ApplicationCommandOptionChoice[]> {


    switch (engine) {
        case "urban-dictionary": {
            // TODO: fix types
            let complete: any = await fetch(urbanBaseURL + "autocomplete?" + new URLSearchParams({ term: input })).then((response) => response.json());

            let wordList = complete.map((word: string) => ({ name: word, value: word })).slice(0, 25);

            if (!wordList.length) return [];

            if ((wordList[0].name.toLowerCase() !== input.toLowerCase())) {
                wordList.unshift({ name: input, value: input });
            }

            return wordList;
        }

    }
    return [];

}