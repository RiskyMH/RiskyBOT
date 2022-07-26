import { EmbedBuilder, inlineCode, SlashCommandBuilder } from "@discordjs/builders";
import type { Config, EnvEnabled } from "@riskybot/tools";

//TODO: Make sure everything works...
//TODO: Make sure all apis listed

export default async function meCredits(config: Config, inviteUrl: string, username?: string) {
    const aboutMe = new EmbedBuilder();
    const credits = new EmbedBuilder();

    aboutMe
        .setTitle("About - " + inlineCode(username ?? "RiskyBOT"))
        .setDescription("This is a random multi-purpose bot. (more coming soon)"+`${username == "RiskyBOT" ? "": "\n\nThis bot using [RiskyBOT](https://riskymh.github.io/RiskyBOT)"}`)
        .setColor(config.getColors().ok)
        .addFields([{ name:
            "Links", value:
            `• [Invite](${inviteUrl})\n• [GitHub](https://github.com/RiskyMH/RiskyBOT)\n• [Help/info](https://RiskyMH.github.io/RiskyBOT)\n• [Server](https://discord.gg/34sQduaUh2)`
        }])
        .addFields([{ name: "Commands", value: "This bot only uses **Slash Commands**"}]);

    credits
     .setTitle("Credits - " + inlineCode(username ?? "RiskyBOT"))
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
      "• Profile Pic: [Flat Icon (Robot)](https://www.flaticon.com/free-icon/robot_2021646)\n• Programming - [nodejs](https://nodejs.org), [discord api](https://discord.com/developers)\n• Hosting - [railway](https://railway.app?referralCode=4kwikB)"
     }]);
    return { embeds: [aboutMe, credits] };
}


export function applicationCommands(config?: Config, envEnabledList?: EnvEnabled) {
    // eslint-disable-next-line no-unused-expressions
    config; envEnabledList; // Just so it is used
    
    const aboutmeSlashCommand = new SlashCommandBuilder()
        .setName("-aboutme-credits-")
        .setDescription("Replies information about me and my credits");
    return [aboutmeSlashCommand];
}