// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// //  @ts-nocheck
import { EmbedBuilder } from "discord.js";
import type { Client } from "discord.js";
import { default as translateFunc, languages } from "translatte";
import * as tools from "@riskybot/tools";
import type { Config } from "@riskybot/tools";


export default async function translate(client: Client, config: Config, input: string, to: string, from: string) {
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
        .addFields({name: await languages[await ans.from.language.iso], value: tools.trim(await input, 1024), inline: true})
        .addFields({name: await languages[to], value: tools.trim(await translated, 1024), inline: true});

    return { embeds: [exampleEmbed] };
}