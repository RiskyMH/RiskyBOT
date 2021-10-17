const { MessageEmbed } = require("discord.js");
const discordjs = require("discord.js");
const {
  time,
  hyperlink,
  inlineCode,
  userMention,
} = require("@discordjs/builders");
const tools = require("../tools.js");

/**
 * @param {discordjs.Client} client
 * @param {discordjs.HexColorString} color
 * @param {number} interMade
 * @export {discordjs.InteractionReplyOptions}
 */

module.exports.ping = async function (client, color, interMade) {
  let ping = new MessageEmbed()
    .setTitle("Ping")
    .setColor(color)
    .setDescription(
      `🏓Latency is \`${Date.now()-interMade}\`ms. API Latency is \`${Math.round(
        client.ws.ping)}\`ms`);

  return {
    embeds: [ping],
    ephemeral: true,
  };
  // interaction.reply({
  //   content: "Pong! (~ " + client.ws.ping + "ms)",
  //   ephemeral: true,
  // });
};
