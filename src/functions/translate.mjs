import { MessageEmbed } from "discord.js";
import { inlineCode } from "@discordjs/builders";
import { default as translateFunc, languages } from "translatte";
import * as tools from "../tools.mjs";

/**
 * @param {import("discord.js").Client} client
 * @param {string} input
 * @param {string} to
 * @param {string} from
 * @param {import("discord.js").HexColorString} color
 * @return {Promise <import("discord.js").InteractionReplyOptions>}
 */

export default async function translate(client, input, to, from, color) {

    /** @type Object */
    let ans = await translateFunc((input), { to: to, from: from });
    let translated = await ans.text;

    const exampleEmbed = new MessageEmbed()
        .setColor(color)
        .setTitle("Translate - " + inlineCode(tools.trim(input, 15)))
        .setURL(tools.trim(`https://translate.google.com?sl=${await ans.from.language.iso??"en"}&tl=${to??"en"}&text=${encodeURIComponent(input)}`, 1024))
        .setAuthor({
            name: "google translate (via: github/translatte)",
            url: "https://github.com/extensionsapp/translatte/"
        })
        .addField(await await languages[await ans.from.language.iso], tools.trim(await input, 1024), true)
        .addField(await await languages[to], tools.trim(await translated, 1024), true);

    return { embeds: [exampleEmbed] };
}