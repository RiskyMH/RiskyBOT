// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { EmbedBuilder } from "discord.js";
import fetch from "node-fetch";
import { codeBlock, inlineCode } from "@discordjs/builders";
import * as tools from "@riskybot/tools";

/**
 * @param {import("discord.js").Client} client
 * @param { string } engine
 * @param {string} input
 * @param {string} input2
 * @param {import("discord.js").HexColorString} color
 * @param {import("discord.js").HexColorString} colorErr
 * @return {Promise <import("discord.js").InteractionReplyOptions>}
 */

export default async function toolsCmd(client, engine, input, input2, color, colorErr) {
    let toolsEmb = new EmbedBuilder().setTitle("Tools").setColor(color);
    let errorEmb = new EmbedBuilder().setTitle("Errors - tools").setColor(colorErr);

    switch (engine) {
        case "rhymes": {
            /** @type {{word:string}[]} */ // @ts-expect-error - yes
            let rhymes = await fetch("https://rhymebrain.com/talk?" + new URLSearchParams({ function: "getRhymes", maxResults: "10", word: input })).then((response) => response.json());
            
            if (await rhymes.length) {
                let list = [];
                for (let rhyme in rhymes){
                    list.push(`${Number(rhyme)+1}: ${rhymes[rhyme].word}`);
                }
                toolsEmb
                    .setAuthor({name: "Rhyme Brain", url: "https://rhymebrain.com/en"})
                    .setURL(`https://rhymebrain.com/en/What_rhymes_with_${input}.html`)
                    .setTitle("Words that rhyme - " + inlineCode(tools.trim(input, 15)))
                    .setDescription(list.join("\n"));
            } else {
                errorEmb.setDescription("no findings :(");
                return { embeds: [errorEmb], ephemeral: true };
            }
        }
        break;
        case "pastebin": {
            let data = {
             name: "Discord Paste - (RiskyBOT)",
             description: "The data",
             visibility: "unlisted",
             //  expires: "",
             files: [
              {
               name: "Downloaded data"+input2? `.${input2}`: "",
               content: {
                   format: "text",
                    highlight_language: input2,
                    value: input
               },
              },
             ],
            };
            /** @type {Object} */
            let pastegg = await fetch("https://api.paste.gg/v1/pastes", {body:JSON.stringify(data), headers: {"Content-Type": "application/json"}, method: "POST"}).then((response) => response.json());
            console.log(pastegg);
            if (await pastegg?.result) {

                toolsEmb
                    .setAuthor({name: "Paste.gg", url: "https://paste.gg"})
                    .setURL(`https://paste.gg/p/anonymous/${pastegg.result.id}`)
                    .setTitle("Upload code - `Paste.gg`")
                    .setDescription(`Code: ${codeBlock(input2, input)}\nURL: https://paste.gg/p/anonymous/${pastegg.result.id}\n||Deleation key: ${inlineCode(pastegg.result.deletion_key)}||`);
            } else {
                errorEmb.setDescription("no findings :(");
                return { embeds: [errorEmb], ephemeral: true };
            }
        }
        break;

        case "8ball": {
            const randomIndex = Math.floor(
                Math.random() * ballResponses.length
            );
            toolsEmb
            .setTitle("🎱 8Ball")
            .setDescription(`Q: ${input}\nA: ${ballResponses[randomIndex]}`);

        }
        break;

        case "choose": {

            const randomIndex = Math.floor(
                Math.random() * input.split(",").length
            );
            toolsEmb
            .setTitle("Choose")
            .setDescription(`I choose.. ${input.split(",")[randomIndex]}!`);

        }

    }
    return { embeds: [toolsEmb] };
}

const ballResponses = [
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes definitely.",
    "You may rely on it.", 

    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",

    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.", 

    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful. ",
];

