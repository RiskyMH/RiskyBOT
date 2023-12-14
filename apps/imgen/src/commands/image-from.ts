import { SlashCommandAttachmentOption, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import Command from "@riskybot/command";
import { ApplicationCommandInteraction } from "discord-api-parser";
import { ImageFormat } from "discord-api-types/v10";


export default class ImageFrom extends Command {
    override name = "image-from";
    override description = "Get an image...";

    override command = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("user")
                .setDescription("Get an image from a user's avatar")
                .addUserOption(
                    new SlashCommandUserOption()
                        .setName("user")
                        .setDescription("The user to get the image from")
                        .setRequired(true)
                )
        ).addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("attachment")
                .setDescription("Get an image from an attachment")
                .addAttachmentOption(
                    new SlashCommandAttachmentOption()
                        .setName("attachment")
                        .setDescription("The attachment to get the image from")
                        .setRequired(true)
                )
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
                if (user.avatar) data.push(`Avatar URL: ${user.avatarURL({ size: 1024, extension: ImageFormat.PNG })}`);
                if (member?.avatar) data.push(`Server Avatar URL: ${member.memberAvatarURL({ size: 1024, extension: ImageFormat.PNG })}`);
                if (user.banner) data.push(`Banner URL: ${user.bannerURL({ size: 1024, extension: ImageFormat.PNG })}`);

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