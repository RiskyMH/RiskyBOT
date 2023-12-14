import { SlashCommandBuilder } from "@discordjs/builders";
import Command from "@riskybot/command";
import { ApplicationCommandInteraction } from "discord-api-parser";


export default class Ping extends Command {
    override name = "ping";
    override description = "Why are you trying to ping me?";

    override command = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description);

    override async handleApplicationCommand(interaction: ApplicationCommandInteraction) {
        return interaction.reply({
            content: `🏓 Latency is \`~${Math.round(Date.now() - Number(interaction.createdAt))}ms\``,
            ephemeral: true
        });
    }

}
