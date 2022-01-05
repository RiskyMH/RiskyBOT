import { MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import { inlineCode, italic } from "@discordjs/builders";
import * as tools from "../tools.mjs";

const urbanBaseURL = "https://api.urbandictionary.com/v0/";

/**
 * @param {import("discord.js").Client} client
 * @param { string } engine
 * @param {string} input
 * @param {import("discord.js").HexColorString} color
 * @param {import("discord.js").HexColorString} colorErr
 * @return {Promise <import("discord.js").InteractionReplyOptions>}
 */

export default async function search(client, engine, input, color, colorErr) {
    let searEmb = new MessageEmbed().setTitle("Fun").setColor(color);
    let errorEmb = new MessageEmbed().setTitle("Errors - search").setColor(colorErr);

    try {

        switch (engine) {
            case "urban-dictionary": {
                /** @type Object */
                let urbanDef = await fetch(
                    urbanBaseURL + "define?" + new URLSearchParams({ term: input })
                ).then((response) => response.json());
                if (await urbanDef.list.length) {
                    let urbanChosen = await urbanDef.list[0];
                    searEmb
                        .addField(
                            "Definition",
                            tools.trim(await urbanChosen.definition, 1024)
                        )
                        .addField(
                            "Example",
                            tools.trim(italic(await urbanChosen.example), 1024)
                        )
                        .addField(
                            "Stats",
                            `\`👍${await urbanChosen.thumbs_up}\` \`👎${await urbanChosen.thumbs_down}\``
                        )
                        .setAuthor({
                            name: "Urban Dictionary",
                            url: "https://www.urbandictionary.com/",
                        })
                        .setURL(await urbanChosen.permalink)
                        .setTimestamp(await urbanChosen.written_on)
                        .setFooter({text: "Defined by: " + (await urbanChosen.author)})
                        .setTitle(
                            "Search - " + inlineCode(tools.trim(urbanChosen.word, 15))
                        );
                } else {
                    errorEmb.setDescription("no findings :(");
                    return { embeds: [errorEmb] };
                }
            }
            break;
        case "lyrics": {
            /** @type Object */
            let lyrics = await fetch("https://some-random-api.ml/" + "lyrics?" + new URLSearchParams({ title: input })).then((response) => response.json());
            if (await lyrics?.lyrics) {
                searEmb
                   .setThumbnail(await lyrics.thumbnail?.genius)
                   .setAuthor({ name: "Some Random Api", url: "https://some-random-api.ml", iconURL: "https://i.some-random-api.ml/logo.png" })
                    .setURL(await lyrics.links?.genius)
                    .setDescription(tools.trim(lyrics.lyrics, 4096 ))
                    .setTitle(
                        "Search - " + inlineCode(tools.trim(await lyrics.title + " ("+await lyrics.author+")", 25))
                    );
                if (lyrics.links?.genius) searEmb.setFooter({text: "Powered by Genius"});

            } else {
                errorEmb.setDescription("no findings :(");
                return { embeds: [errorEmb] };
            }
        }

        }
        return { embeds: [searEmb] };
    } catch (err) { console.log(err); return { embeds: [errorEmb.setDescription("A error happened :(")], ephemeral: true }; }
}

/**
 * @param {import("discord.js").Client} client
 * @param {string} input
 * @param { string } engine
 * @return { Promise <import("discord.js").ApplicationCommandOptionChoice[]> }
 */

export async function autoComplete(client, engine, input) {
    try {
        /** @type Object */
        let urbanOpt = {};

        switch (engine) {
            case "urban-dictionary": {

                urbanOpt = await fetch(urbanBaseURL + "autocomplete?" + new URLSearchParams({ term: input })).then((response) => response.json());

                let wordList = urbanOpt.map(word => ({ name: word, value: word })).slice(0, 25);

                if (!wordList.length) return [];

                if ((wordList[0].name.toLowerCase() !== input.toLowerCase())) {
                    wordList.unshift({ name: input, value: input });
                }

                return wordList;
            }

        }
    } catch {console.log;}

}