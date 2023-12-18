// @jsxImportSource @riskybot/builders
import Command from "@riskybot/command";
import type { ApplicationCommandInteraction } from "discord-api-parser";
import { ApplicationCommand, UserOption, SubCommandOption, AttachmentOption } from "@lilybird/jsx";


export default class ImageFrom extends Command {
    override name = "image-from";
    override description = "Get an image...";

    override command = (
        <ApplicationCommand name={this.name} description={this.description}>
            <SubCommandOption name="user" description="Get an image from a user's avatar">
                <UserOption name="user" description="The user to get the image from" required />
            </SubCommandOption>

            <SubCommandOption name="attachment" description="Get an image from an attachment">
                <AttachmentOption name="attachment" description="The attachment to get the image from" required />
            </SubCommandOption>
        </ApplicationCommand>
    );

    override async handleApplicationCommand(interaction: ApplicationCommandInteraction) {
        // Must be from a slash command (should always be anyway)
        if (!interaction.isChatInputCommand()) return;


        const subcommand = interaction.options.getSubcommand(true);

        switch (subcommand) {
            case "user": {
                const user = interaction.options.getUser("user", true);
                const member = interaction.options.getMember("user", false);
                const data = [];

                data.push(`Default avatar URL: <${user.defaultAvatarURL}>`);
                if (user.avatar) data.push(`Avatar URL: ${user.avatarURL({ size: 1024, extension: "png" })}`);
                if (member?.avatar) data.push(`Server Avatar URL: ${member.memberAvatarURL({ size: 1024, extension: "png" })}`);
                if (user.banner) data.push(`Banner URL: ${user.bannerURL({ size: 1024, extension: "png" })}`);

                return interaction.reply({ content: data.join("\n") });
            }

            case "attachment": {
                const attachment = interaction.options.getAttachment("attachment", true);
                const content = `Attachment URL: ${attachment.url}`;

                return interaction.reply({ content });
            }

        }

        throw new Error("Unknown subcommand");
    }
}