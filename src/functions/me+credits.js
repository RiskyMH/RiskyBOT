const { MessageEmbed } = require("discord.js");
const discordjs = require("discord.js");
const {
  time,
  hyperlink,
  inlineCode,
  userMention,
} = require("@discordjs/builders");
const tools = require("../tools.js");
const { Permissions } = require("discord.js");

/**
 * @param {discordjs.Client} client
 * @param {discordjs.HexColorString} color
 * @export {discordjs.InteractionReplyOptions}
 */

module.exports = async function (client, color) {
  let aboutMe = new MessageEmbed();
  let credits = new MessageEmbed();

const invite = client.generateInvite({
  permissions: [
    Permissions.FLAGS.MANAGE_WEBHOOKS,
    Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
    Permissions.FLAGS.ADD_REACTIONS,
  ],
  scopes: ["bot", "applications.commands"],
});
  aboutMe
    .setTitle("About - " + inlineCode(client.user.username))
    .setDescription("This is a random multi-purpose bot. (more coming soon)")
    .setColor(color)
    .addField("Links", `• [Invite](${invite})\n• [GitHub](https://github.com/RiskyMH/RiskyBOT)\n• [Help/info](https://RiskyMH.github.io/RiskyBOT)\n• [Server](https://discord.gg/34sQduaUh2)`)
    .addField("Commands", "This bot only uses **Slash Commands**")

  credits
    .setTitle("Credits - " + inlineCode(client.user.username))
    .setColor(color)
    .addField(
      "Developers",
      "• RiskyMH ([GitHub](https://github.com/RiskyMH/), [Top.gg](https://top.gg/user/233066116933705728))"
    )
    .addField(
      "APIs",
      "• Google Translate (via: [cjrsgu](https://github.com/cjrsgu/google-translate-api-browser)) -  `translate`\n• Deep AI  ([link](https://deepai.org/)) - `deep-ai`\n• Random.cat ([link](https://aws.random.cat/)) - `random (cat)`\n• Nekobot ([link](https://nekobot.xyz/)) - `fun (most of them)`"
    )
    .addField(
      "General",
      "• Profile Pic: [Flat Icon (Robot)](https://www.flaticon.com/free-icon/robot_2021646)\n• Programming - [discord.js](https://discord.js.org/), [nodejs](https://nodejs.org), [discord api](https://discord.com/developers)\n• Hosting - [replit](https://replit.com/) (at: [repl.co](http://riskybot.riskymh.repl.co/]))"
    );
    return { embeds: [aboutMe, credits] };
};
