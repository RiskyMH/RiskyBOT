// @jsxImportSource @riskybot/builders
import Command from "@riskybot/command";
import type { ApplicationCommandInteraction } from "discord-api-parser";
import { ApplicationCommand } from "@lilybird/jsx";


export default class Ping extends Command {
    override name = "ping";
    override description = "Why are you trying to ping me?";

    override command = (
        <ApplicationCommand name={this.name} description={this.description} />
    );

    override async handleApplicationCommand(interaction: ApplicationCommandInteraction) {
        return interaction.reply({
            content: `🏓 Latency is \`~${Math.round(Date.now() - Number(interaction.createdAt))}ms\``,
            ephemeral: true
        });
    }

}
