import { MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import { codeBlock, inlineCode } from "@discordjs/builders";
import * as tools from "../tools.mjs";

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
    let toolsEmb = new MessageEmbed().setTitle("Tools").setColor(color);
    let errorEmb = new MessageEmbed().setTitle("Errors - tools").setColor(colorErr);

    try {

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
                    return { embeds: [errorEmb] };
                }
            }
            break;
            case "pastebin": {
                /** @type {Object} */
               let hastebin = await fetch("https://hst.sh/documents", {body: input, method: "POST"}).then((response) => response.json());
               
                if (await hastebin) {

                    toolsEmb
                        .setAuthor({name: "Hastebin", url: "https://hst.sh"})
                        .setURL(`https://hst.sh/${hastebin.key+(input2?"."+input2: "")}`)
                        .setTitle("Upload code - `Hastebin`")
                        .setDescription(`Code: ${codeBlock(input2, input)}\nURL: https://hst.sh/${hastebin.key+(input2?"."+input2: "")}`);
                } else {
                    errorEmb.setDescription("no findings :(");
                    return { embeds: [errorEmb] };
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
    } catch (err) { console.log(err); return { embeds: [errorEmb.setDescription("A error happened :(")], ephemeral: true }; }
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

