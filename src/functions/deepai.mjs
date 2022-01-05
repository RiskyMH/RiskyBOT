import { MessageEmbed } from "discord.js";
import { bold, inlineCode } from "@discordjs/builders";
import * as tools from "../tools.mjs";
import { default as deepaiFunc } from "deepai";
/**
 * @param {import("discord.js").Client} client
 * @param {string} input
 * @param {string} type
 * @param {import("discord.js").HexColorString} color
 * @param {string} deepaiKey
 * @return {Promise <import("discord.js").InteractionReplyOptions>}
 */

export default async function deepai(client, input, type, color, deepaiKey) {
    if (!deepaiKey) { console.error("DeepAI requires key"); return { content: "DeepAI not working" }; }

    deepaiFunc.setApiKey(deepaiKey);
    let deepEmbed = new MessageEmbed();

    switch (type) {
        case "text-generator":
            var resp = await deepaiFunc.callStandardApi("text-generator", { text: (input) });
            deepEmbed
                .setTitle("Text generation - " + inlineCode(tools.trim(input, 15)))
                .setURL("https://deepai.org/machine-learning-model/text-generator")
                .setDescription(tools.trim(await resp.output.replace(input, bold(input)), 4096 ))
                .setFooter({text:"AI made by: deepai"});

            break;

            // switch
    }
    deepEmbed
        .setAuthor({name: "deepai", url: "https://deepai.org/"})
        .setColor(color);

    return { embeds: [deepEmbed] };

}