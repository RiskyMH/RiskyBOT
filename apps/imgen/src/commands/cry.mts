import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import Command from "@riskybot/command";
import { cry } from "@riskybot/image-generate";
import { ApplicationCommandInteraction, AttachmentBuilder } from "discord-api-parser";


export default class Cry extends Command {
    name = "cry";
    description = "Show everyone why you are crying";

    command = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption(
            new SlashCommandStringOption()
                .setName("reason")
                .setDescription("The reason that you are crying")
                .setRequired(true)
        );

    async handleApplicationCommand(interaction: ApplicationCommandInteraction) {
        // Must be from a slash command (should always be anyway)
        if (!interaction.isChatInputCommand()) return;

        const text = interaction.options.getString("reason", true);
        const data = await cry({ text });

        if (!(data instanceof Buffer)) {
            return interaction.reply({ content: "Error?", ephemeral: true });
        }

        const attachment = new AttachmentBuilder(data, "cry.png");

        await interaction.reply({ content: `Don't cry <@${interaction.userId}>`, attachments: [attachment] });
    }
}

