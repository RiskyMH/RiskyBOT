
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, MessageActionRowComponentBuilder } from "@discordjs/builders";
import {Util} from "discord.js";
import { ButtonStyle } from "discord-api-types/v10";


/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").HexColorString} color
 * @param {number} interMade
 * @return { Promise < import("discord.js").InteractionReplyOptions > }
 */

export async function ping (client, color, interMade) {
  let row = new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents(new ButtonBuilder().setLabel("Again").setCustomId("ping").setStyle(ButtonStyle.Secondary));
  let ping = new EmbedBuilder()
    .setTitle("Pong")
    .setColor(Util.resolveColor(color))
    .setDescription(`🏓 Latency is \`~${Date.now()-interMade}\`ms. API Latency is \`~${Math.round(client.ws.ping)}\`ms`);

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
