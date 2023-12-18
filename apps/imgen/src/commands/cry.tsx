// @jsxImportSource @riskybot/builders
import Command from "@riskybot/command";
import { cry } from "@riskybot/image-generate";
import { type ApplicationCommandInteraction, AttachmentBuilder } from "discord-api-parser";
import { ApplicationCommand, StringOption } from "@lilybird/jsx";


export default class Cry extends Command {
    override name = "cry";
    override description = "Show everyone why you are crying";

    override command = (
        <ApplicationCommand name={this.name} description={this.description}>
            <StringOption
                name="reason"
                description="The reason that you are crying"
                required
            />
        </ApplicationCommand>
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

