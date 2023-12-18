// @jsxImportSource @riskybot/builders
import config from "#config.ts";
import { ApplicationCommand, Embed, EmbedField } from "@lilybird/jsx";
import Command from "@riskybot/command";
import type { ApplicationCommandInteraction } from "discord-api-parser";


export default class AboutMe_Credits extends Command {
    override name = "-aboutme-credits-";
    override description = "Replies information about RiskyBOT and my credits";

    override command = (
        <ApplicationCommand name={this.name} description={this.description} />
    );

    override async handleApplicationCommand(interaction: ApplicationCommandInteraction) {

        const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${interaction.applicationId}&scope=applications.commands`;


        const aboutMe = (
            <Embed
                title="<:RiskyBOT:894756429251088394> About RiskyBOT"
                url="https://bot.riskymh.dev"
                description="This is a random multi-purpose bot. (more coming soon)"
                color={config.colors.ok}
            >
                <EmbedField
                    name="Links"
                    value={[
                        `* [Invite](${inviteUrl})`,
                        "* [GitHub](https://github.com/RiskyMH/RiskyBOT)]",
                        "* [Website](https://bot.riskymh.dev)",
                        "* [Server](https://discord.gg/BanFeVWyFP)",
                        "* [Privacy Policy](https://bot.riskymh.dev/legal)"
                    ].join("\n")}
                />

                <EmbedField
                    name="Commands"
                    value="This bot only uses **Slash Commands**"
                />
            </Embed>
        );


        const credits = (
            <Embed title="Credits for RiskyBOT" color={config.colors.ok}>
                <EmbedField
                    name="Developers"
                    value="* RiskyMH ([GitHub](https://github.com/RiskyMH), [Website](https://riskymh.dev), [Top.gg](https://top.gg/user/233066116933705728))"
                />

                <EmbedField
                    name="APIs"
                    value="All APIs used are mentioned in their respective commands."
                />

                <EmbedField
                    name="General"
                    value={[
                        "* Profile Pic: [Flat Icon (Robot)](https://www.flaticon.com/free-icon/robot_2021646)",
                        "* Programming - [Node.js](https://nodejs.org), [Discord API](https://discord.com/developers)",
                        "* Hosting - [Vercel](https://vercel.com)"
                    ].join("\n")}
                />
            </Embed>
        );

        return interaction.reply({ embeds: [aboutMe, credits] });

    }

}
