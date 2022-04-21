
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// //  @ts-nocheck

import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, MessageActionRowComponentBuilder } from "@discordjs/builders";
import type {Client, InteractionReplyOptions} from "discord.js";
import { ButtonStyle } from "discord-api-types/v10";
import type { Config } from "@riskybot/tools";


export async function ping (client: Client, config: Config, interMade: number): Promise<InteractionReplyOptions> {
  let row = new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents(new ButtonBuilder().setLabel("Again").setCustomId("ping").setStyle(ButtonStyle.Secondary));
  let ping = new EmbedBuilder()
    .setTitle("Pong")
    .setColor(config.getColors().ok)
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
