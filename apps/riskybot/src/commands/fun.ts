import config from "#config.ts";
import { EmbedBuilder, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import Command from "@riskybot/command";
import { affect } from "@riskybot/image-generate";
import { ApplicationCommandInteraction, AttachmentBuilder } from "discord-api-parser";


export default class Fun extends Command {
    override name = "fun";
    override description = "🤣 Produces fun results";

    override command = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("affect")
                .setDescription("Show everyone what affected you")
                .addUserOption(
                    new SlashCommandUserOption()
                        .setName("user")
                        .setDescription("The user that is used")
                        .setRequired(false)
                )
        );

    override async handleApplicationCommand(interaction: ApplicationCommandInteraction) {
        // Must be from a slash command (should always be anyway)
        if (!interaction.isChatInputCommand()) return;

        const type = interaction.options.getSubcommand(true);

        switch (type) {
            case "affect": {
                // let avatarUrl = interaction.options.getMember("user")?.memberAvatarURL();
                // if (!avatarUrl) avatarUrl = interaction.options.getUser("user").displayAvatarURL();
                const member = interaction.options.getMember("user") || interaction.member;
                let avatarUrl = member?.memberAvatarURL();
                if (!avatarUrl) {
                    const user = interaction.options.getUser("user") || interaction.user;
                    avatarUrl = user.displayAvatarURL();
                }

                const data = await affect({ imgLink: avatarUrl });

                if (!(data instanceof Buffer)) {
                    const errorEmb = new EmbedBuilder()
                        .setTitle("Error with affect")
                        .setColor(config.colors.error)
                        .setDescription(data.error ?? "Unknown error");

                    return interaction.reply({ embeds: [errorEmb], ephemeral: true });
                }

                const embed = new EmbedBuilder()
                    .setTitle("Affect")
                    .setColor(config.colors.ok)
                    .setImage("attachment://affect.png");

                const attachment = new AttachmentBuilder(data, "affect.png");

                await interaction.reply({ embeds: [embed], attachments: [attachment] });
            }
        }

    }
}
