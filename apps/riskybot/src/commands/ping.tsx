// @jsxImportSource @riskybot/builders
import config from "#config.ts";
import Command from "@riskybot/command";
import type { ApplicationCommandInteraction, MessageComponentInteraction } from "discord-api-parser";
import { ApplicationCommand, Embed, ActionRow, Button, EmbedFooter } from "@lilybird/jsx";
import { ButtonStyle } from "lilybird";

let numPings = 0;

export default class Hello extends Command {
    override name = "ping";
    override description = "Say hello to the bot";
    override namePrefix = "ping";

    override command = (
        <ApplicationCommand name={this.name} description={this.description} />
    );

    async handle(interaction: ApplicationCommandInteraction | MessageComponentInteraction) {
        const row = (
            <ActionRow>
                <Button label="Again" id="ping" style={ButtonStyle.Secondary} />
            </ActionRow>
        );

        const ping = (
            <Embed
                title="Pong"
                color={config.colors.ok}
                description={`🏓 Latency is \`~${Math.round(Date.now() - Number(interaction.createdAt))}ms\``}
            >
                <EmbedFooter text={`Ping #${numPings++}`} />
            </Embed>
        );
        
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
