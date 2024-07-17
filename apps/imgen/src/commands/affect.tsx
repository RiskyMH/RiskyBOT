// @jsxImportSource @riskybot/builders
import Command from "@riskybot/command";
import { affect } from "@riskybot/image-generate";
import { type ApplicationCommandInteraction, AttachmentBuilder } from "discord-api-parser";
import { ApplicationCommand, StringOption } from "@lilybird/jsx";


export default class Affect extends Command {
    override name = "affect";
    override description = "Show everyone what affected you";

    override command = (
        <ApplicationCommand name={this.name} description={this.description}>
            <StringOption
                name="img"
                description="The link to an image describing you/someone"
                required
            />
        </ApplicationCommand>
    );

    override async handleApplicationCommand(interaction: ApplicationCommandInteraction) {
        // Must be from a slash command (should always be anyway)
        if (!interaction.isChatInputCommand()) return;

        const imgLink = interaction.options.getString("img", true);
        const data = await affect({ imgLink });

        if (!(data instanceof Buffer)) {
            return interaction.reply({ content: "Error?", ephemeral: true });
        }

        const attachment = new AttachmentBuilder(data, "affect.png");

        await interaction.reply({ content: `True story of <@${interaction.userId}>`, attachments: [attachment] });
    }
}

