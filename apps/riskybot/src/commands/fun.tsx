// @jsxImportSource @riskybot/builders
import config from "#config.ts";
import { ApplicationCommand, Embed, EmbedImage, UserOption } from "@lilybird/jsx";
import Command from "@riskybot/command";
import { affect } from "@riskybot/image-generate";
import { type ApplicationCommandInteraction, AttachmentBuilder } from "discord-api-parser";


export default class Fun extends Command {
    override name = "fun";
    override description = "🤣 Produces fun results";

    override command = (
        <ApplicationCommand name={this.name} description={this.description}>
            <ApplicationCommand name="affect" description="Show everyone what affected you">
                <UserOption name="user" description="The user that is used" required={false} />
            </ApplicationCommand>
        </ApplicationCommand>
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
                    const errorEmb = (
                        <Embed
                            title="Error with affect"
                            color={config.colors.error}
                            description={data.error ?? "Unknown error"}
                        />
                    );

                    return interaction.reply({ embeds: [errorEmb], ephemeral: true });
                }

                const embed = (
                    <Embed title="Affect" color={config.colors.ok}>
                        <EmbedImage url="attachment://affect.png" />
                    </Embed>
                );

                const attachment = new AttachmentBuilder(data, "affect.png");

                await interaction.reply({ embeds: [embed], attachments: [attachment] });
            }
        }

    }
}
