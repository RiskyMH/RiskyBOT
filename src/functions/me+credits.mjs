import { MessageEmbed } from "discord.js";
import { inlineCode } from "@discordjs/builders";
import { Permissions } from "discord.js";

/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").HexColorString} color
 * @return {Promise <import("discord.js").InteractionReplyOptions>}
 */

export default async function meCredits(client, color) {
    let aboutMe = new MessageEmbed();
    let credits = new MessageEmbed();

    const invite = client.generateInvite({scopes: ["applications.commands"]});
    const invite2 = client.generateInvite({scopes: ["applications.commands", "bot"]});
    aboutMe
        .setTitle("About - " + inlineCode(client.user.username))
        .setDescription("This is a random multi-purpose bot. (more coming soon)"+`${client.user.username == "RiskyBOT"?"": "\n\nThis bot using [RiskyBOT](https://riskymh.github.io/RiskyBOT)"}`)
        .setColor(color)
        .addField(
            "Links",
            `• [Invite](${invite})\n• [GitHub](https://github.com/RiskyMH/RiskyBOT)\n• [Help/info](https://RiskyMH.github.io/RiskyBOT)\n• [Server](https://discord.gg/34sQduaUh2)`
        )
        .addField("Commands", "This bot only uses **Slash Commands**");

    credits
     .setTitle("Credits - " + inlineCode(client.user.username))
     .setColor(color)
     .addField(
      "Developers",
      "• RiskyMH ([GitHub](https://github.com/RiskyMH/), [Top.gg](https://top.gg/user/233066116933705728))"
     )
     .addField(
      "APIs",
      "• Google Translate (via: [github/translatte](https://github.com/extensionsapp/translatte))\n• Deep AI  ([link](https://deepai.org/))\n• Random.cat ([link](https://aws.random.cat/))\n• Nekobot ([link](https://nekobot.xyz/))\n• Some Random Api ([link](https://some-random-api.m/))\n• Dog CEO ([link](https://dog.ceo/))\n• Shibe Online ([link](https://shibe.online/))\n• Random-d.uk ([link](https://random-d.uk/))\n• Forismatic ([link](https://forismatic.com/en))\n• Affirmations.dev ([link](https://github.com/annthurium/affirmations))\n• Useless Facts.pl ([link](https://uselessfacts.jsph.pl/))\n• Urban Dictionary ([link](https://www.urbandictionary.com/))\n• Reddit ([link](https://www.reddit.com/))"
     )
     .addField(
      "General",
      "• Profile Pic: [Flat Icon (Robot)](https://www.flaticon.com/free-icon/robot_2021646)\n• Programming - [discord.js](https://discord.js.org/), [nodejs](https://nodejs.org), [discord api](https://discord.com/developers)\n• Hosting - [replit](https://replit.com/) (at: [repl.co](http://riskybot.riskymh.repl.co/]))"
     );
    return { embeds: [aboutMe, credits] };
}

/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").HexColorString} color
 * @return {Promise <import("discord.js").InteractionReplyOptions>}
 */

export async function extra(client, color) {
    let aboutMe = new MessageEmbed();
    let credits = new MessageEmbed();

    const invite = client.generateInvite({
        permissions: [
            Permissions.FLAGS.MANAGE_WEBHOOKS,
            Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
            Permissions.FLAGS.ADD_REACTIONS,
            Permissions.FLAGS.SEND_MESSAGES,
            Permissions.FLAGS.VIEW_CHANNEL
        ],
        scopes: ["bot", "applications.commands"],
    });
    aboutMe
        .setTitle("About - " + inlineCode(client.user.username))
        .setDescription("This is a random multi-purpose bot. (more coming soon)")
        .setColor(color)
        .addField(
            "Links",
            `• [Invite](${invite})\n• [GitHub](https://github.com/RiskyMH/RiskyBOT)\n• [Help/info](https://RiskyMH.github.io/RiskyBOT)\n• [Server](https://discord.gg/34sQduaUh2)\n• [All the \`RiskyBOTs\`](https://RiskyMH.github.io/RiskyBOT/RiskyBOTs)`
        )
        .addField("Commands", "This bot has some Slash commands,\nbut also does some text based commands\n• This bot reacts to certain words (eg `hello` reacts with `👋`");
    credits
        .setTitle("Credits - " + inlineCode(client.user.username))
        .setColor(color)
        .addField(
            "Developers",
            "• RiskyMH ([GitHub](https://github.com/RiskyMH/), [Top.gg](https://top.gg/user/233066116933705728))"
        )
        .addField(
            "APIs",
            "(no APIs yet)"
        )
        .addField(
            "General",
            "• Profile Pic: [Flat Icon (Robot)](https://www.flaticon.com/free-icon/robot_2021646)\n• Programming - [discord.js](https://discord.js.org/), [nodejs](https://nodejs.org), [discord api](https://discord.com/developers)\n• Hosting - [replit](https://replit.com/) (at: [repl.co](http://riskybot.riskymh.repl.co/]))"
        );

    return { embeds: [aboutMe, credits] };

}