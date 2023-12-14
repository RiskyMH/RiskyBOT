import config from "#config.ts";
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, MessageActionRowComponentBuilder, SlashCommandBuilder } from "@discordjs/builders";
import Command from "@riskybot/command";
import { ApplicationCommandInteraction, MessageComponentInteraction } from "discord-api-parser";
import { ButtonStyle } from "discord-api-types/v10";

let numPings = 0;

export default class Hello extends Command {
    override name = "ping";
    override description = "Say hello to the bot";
    override namePrefix = "ping";

    override command = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description);

    async handle(interaction: ApplicationCommandInteraction | MessageComponentInteraction) {
        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
            .setComponents([
                new ButtonBuilder()
                    .setLabel("Again")
                    .setCustomId("ping")
                    .setStyle(ButtonStyle.Secondary)
            ]);

        const ping = new EmbedBuilder()
            .setTitle("Pong")
            .setColor(config.colors.ok)
            .setDescription(`🏓 Latency is \`~${Math.round(Date.now() - Number(interaction.createdAt))}ms\``)
            .setFooter({ text: `Ping #${numPings++}` });
        
        // if it is a button, update the message instead of sending a new one
        if (interaction.isButton()) {
            return interaction.update({ embeds: [ping], components: [row], ephemeral: true });
        }

        await interaction.reply({ embeds: [ping], components: [row], ephemeral: true });
    }

    override async handleApplicationCommand(interaction: ApplicationCommandInteraction) {
        await this.handle(interaction);
    }

    override async handleMessageComponent(interaction: MessageComponentInteraction) {
        await this.handle(interaction);
    }

}
