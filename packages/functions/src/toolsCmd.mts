// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// //  @ts-nocheck
import { EmbedBuilder } from "discord.js";
import type { Client } from "discord.js";
import fetch from "node-fetch";
import { codeBlock, inlineCode } from "@discordjs/builders";
import * as tools from "@riskybot/tools";
import type { Config } from "@riskybot/tools";


export default async function toolsCmd(client: Client, config: Config, engine: string, input: string, input2: string) {
    let toolsEmb = new EmbedBuilder().setTitle("Tools").setColor(config.getColors().ok);
    let errorEmb = new EmbedBuilder().setTitle("Errors - tools").setColor(config.getColors().error);

    switch (engine) {
        case "rhymes": {
            // TODO: fix types
            let rhymes: {word:string}[] = await fetch("https://rhymebrain.com/talk?" + new URLSearchParams({ function: "getRhymes", maxResults: "10", word: input })).then((response) => response.json()) as any;
            
            if (rhymes.length) {
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
            // TODO: fix types
            let pastegg: {result: {id: any, deletion_key: any }} = await fetch("https://api.paste.gg/v1/pastes", {body:JSON.stringify(data), headers: {"Content-Type": "application/json"}, method: "POST"}).then((response) => response.json()) as any;
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

