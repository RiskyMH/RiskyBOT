import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import Command from "@riskybot/command";
import { cry } from "@riskybot/image-generate";
import { ApplicationCommandInteraction, AttachmentBuilder } from "discord-api-parser";


export default class Cry extends Command {
    override name = "cry";
    override description = "Show everyone why you are crying";

    override command = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption(
            new SlashCommandStringOption()
                .setName("reason")
                .setDescription("The reason that you are crying")
                .setRequired(true)
        );

    override async handleApplicationCommand(interaction: ApplicationCommandInteraction) {
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

