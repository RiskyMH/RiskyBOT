import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, MessageActionRowComponentBuilder } from "@discordjs/builders";
import { ButtonStyle } from "discord-api-types/v10";
import type { Config } from "@riskybot/tools";


//TODO: Make sure everything works...


let numPings = 0;

export async function ping(config: Config, interMade: number, pingNum?: number) /*Promise<InteractionReplyOptions>*/ {
    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents([new ButtonBuilder().setLabel("Again").setCustomId("ping").setStyle(ButtonStyle.Secondary)]);
    const ping = new EmbedBuilder()
        .setTitle("Pong")
        .setColor(config.getColors().ok)
        .setDescription(`🏓 Latency is \`~${Math.round(Date.now() - interMade)}ms\``)
        .setFooter({ text: `Ping #${numPings++}` });
    if (pingNum) ping.setDescription(`🏓 Latency is \`~${Math.round(Date.now() - interMade)}ms\`. API Latency is \`~${Math.round(pingNum)}\`ms`);

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
