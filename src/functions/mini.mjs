import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").HexColorString} color
 * @param {number} interMade
 * @return { Promise < import("discord.js").InteractionReplyOptions > }
 */

export async function ping (client, color, interMade) {
  let row = new MessageActionRow().setComponents(new MessageButton().setLabel("Again").setCustomId("ping").setStyle("SECONDARY"));
  let ping = new MessageEmbed()
    .setTitle("Pong")
    .setColor(color)
    .setDescription(`🏓Latency is \`~${Date.now()-interMade}\`ms. API Latency is \`~${Math.round(client.ws.ping)}\`ms`);

  return {
    embeds: [ping],
    ephemeral: true,
    components: [row]
  };
  // interaction.reply({
  //   content: "Pong! (~ " + client.ws.ping + "ms)",
  //   ephemeral: true,
  // });
}
