import { SlashCommandBuilder } from "@discordjs/builders";
import Command from "@riskybot/command";
import { ApplicationCommandInteraction } from "discord-api-parser";


export default class Ping extends Command {
    name = "ping";
    description = "Why are you trying to ping me?";

    command = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description);

    async handleApplicationCommand(interaction: ApplicationCommandInteraction) {
        return interaction.reply({
            content: `🏓 Latency is \`~${Math.round(Date.now() - Number(interaction.createdAt))}ms\``,
            ephemeral: true
        });
    }

}
