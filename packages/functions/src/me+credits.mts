import type { Client, InteractionReplyOptions } from "discord.js";
import { EmbedBuilder, inlineCode } from "@discordjs/builders";
import { OAuth2Scopes, PermissionFlagsBits } from "discord-api-types/v10";
import type { Config } from "@riskybot/tools";

//TODO: Make sure everything works...
//TODO: Make sure all apis listed

export default async function meCredits(client: Client, config: Config): Promise <InteractionReplyOptions> {
    let aboutMe = new EmbedBuilder();
    let credits = new EmbedBuilder();

    // @ts-expect-error weird errors
    const invite = client.generateInvite({scopes: [OAuth2Scopes.ApplicationsCommands]});
    // const invite2 = client.generateInvite({ scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot]});
    aboutMe
        .setTitle("About - " + inlineCode(client.user?.username??"RiskyBOT"))
        .setDescription("This is a random multi-purpose bot. (more coming soon)"+`${client.user?.username == "RiskyBOT" ? "": "\n\nThis bot using [RiskyBOT](https://riskymh.github.io/RiskyBOT)"}`)
        .setColor(config.getColors().ok)
        .addFields([{ name:
            "Links", value:
            `• [Invite](${invite})\n• [GitHub](https://github.com/RiskyMH/RiskyBOT)\n• [Help/info](https://RiskyMH.github.io/RiskyBOT)\n• [Server](https://discord.gg/34sQduaUh2)`
        }])
        .addFields([{ name: "Commands", value: "This bot only uses **Slash Commands**"}]);

    credits
     .setTitle("Credits - " + inlineCode(client.user?.username?? "RiskyBOT"))
     .setColor(config.getColors().ok)
     .addFields([{name:
      "Developers", value:
      "• RiskyMH ([GitHub](https://github.com/RiskyMH/), [Top.gg](https://top.gg/user/233066116933705728))"
     }])
     .addFields([{ name: 
      "APIs", value:
      "• Google Translate (via: [github/translatte](https://github.com/extensionsapp/translatte))\n• Deep AI  ([link](https://deepai.org/))\n• Random.cat ([link](https://aws.random.cat/))\n• Nekobot ([link](https://nekobot.xyz/))\n• Some Random Api ([link](https://some-random-api.m/))\n• Dog CEO ([link](https://dog.ceo/))\n• Shibe Online ([link](https://shibe.online/))\n• Random-d.uk ([link](https://random-d.uk/))\n• Forismatic ([link](https://forismatic.com/en))\n• Affirmations.dev ([link](https://github.com/annthurium/affirmations))\n• Useless Facts.pl ([link](https://uselessfacts.jsph.pl/))\n• Urban Dictionary ([link](https://www.urbandictionary.com/))\n• Reddit ([link](https://www.reddit.com/))"
     }])
     .addFields([{name:
      "General", value:
      "• Profile Pic: [Flat Icon (Robot)](https://www.flaticon.com/free-icon/robot_2021646)\n• Programming - [discord.js](https://discord.js.org/), [nodejs](https://nodejs.org), [discord api](https://discord.com/developers)\n• Hosting - [railway](https://railway.app?referralCode=4kwikB)"
     }]);
    return { embeds: [aboutMe, credits] };
}


export async function extra(client: Client, config: Config): Promise <import("discord.js").InteractionReplyOptions> {
    let aboutMe = new EmbedBuilder();
    let credits = new EmbedBuilder();

    const invite = client.generateInvite({
        permissions: [
            PermissionFlagsBits.ManageWebhooks,
            PermissionFlagsBits.UseExternalEmojis,
            PermissionFlagsBits.AddReactions,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ViewChannel
        ],
        // @ts-expect-error weird errors
        scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot],
    });
    aboutMe
        .setTitle("About - " + inlineCode(client.user?.username??"RiskyBOT 2"))
        .setDescription("This is a random multi-purpose bot. (more coming soon)")
        .setColor(config.getColors().ok)
        .addFields([{name:
            "Links", value:
            `• [Invite](${invite})\n• [GitHub](https://github.com/RiskyMH/RiskyBOT)\n• [Help/info](https://RiskyMH.github.io/RiskyBOT)\n• [Server](https://discord.gg/34sQduaUh2)\n• [All the \`RiskyBOTs\`](https://RiskyMH.github.io/RiskyBOT/RiskyBOTs)`
        }])
        .addFields([{name:"Commands", value:"This bot has some Slash commands,\nbut also does some text based commands\n• This bot reacts to certain words (eg `hello` reacts with `👋`"}]);
    credits
        .setTitle("Credits - " + inlineCode(client.user?.username?? "RiskyBOT 2"))
        .setColor(config.getColors().ok)
        .addFields([{name:
            "Developers",value:
            "• RiskyMH ([GitHub](https://github.com/RiskyMH/), [Top.gg](https://top.gg/user/233066116933705728))"
        }])
        .addFields([{name:
            "APIs", value:
            "(no APIs yet)"
        }])
        .addFields([{name:
            "General", value:
            "• Profile Pic: [Flat Icon (Robot)](https://www.flaticon.com/free-icon/robot_2021646)\n• Programming - [discord.js](https://discord.js.org/), [nodejs](https://nodejs.org), [discord api](https://discord.com/developers)\n• Hosting - [replit](https://replit.com/) (at: [repl.co](http://riskybot.riskymh.repl.co/]))"
        }]);

    return { embeds: [aboutMe, credits] };

}