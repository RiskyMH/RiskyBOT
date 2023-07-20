import config from "#config.mjs";
import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import Command from "@riskybot/command";
import { ApplicationCommandInteraction } from "discord-api-parser";


export default class Random extends Command {
    name = "-aboutme-credits-";
    description = "Replies information about RiskyBOT and my credits";

    command = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description);

    async handleApplicationCommand(interaction: ApplicationCommandInteraction) {

        const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${interaction.applicationId}&scope=applications.commands`;

        const aboutMe = new EmbedBuilder()
            .setTitle("<:RiskyBOT:894756429251088394> About RiskyBOT")
            // .setThumbnail("https://bot.riskymh.dev/robot.png")
            .setURL("https://bot.riskymh.dev")
            .setDescription("This is a random multi-purpose bot. (more coming soon)")
            .setColor(config.colors.ok)
            .addFields([{
                name: "Links",
                value: `* [Invite](${inviteUrl})\n* [GitHub](https://github.com/RiskyMH/RiskyBOT)\n* [Website](https://bot.riskymh.dev)\n* [Server](https://discord.gg/34sQduaUh2)\n* [Privacy Policy](https://bot.riskymh.dev/legal)`
            }])
            .addFields([{
                name: "Commands",
                value: "This bot only uses **Slash Commands**"
            }]);

        const credits = new EmbedBuilder()
            .setTitle("Credits for RiskyBOT")
            .setColor(config.colors.ok)
            .addFields([{
                name: "Developers",
                value: "* RiskyMH ([GitHub](https://github.com/RiskyMH/), [Website](https://riskymh.dev), [Top.gg](https://top.gg/user/233066116933705728))"
            }])
            .addFields([{
                name: "APIs",
                value: "All APIs used are mentioned in their respective commands."
            }])
            .addFields([{
                name: "General",
                value: "* Profile Pic: [Flat Icon (Robot)](https://www.flaticon.com/free-icon/robot_2021646)\n* Programming - [Node.js](https://nodejs.org), [Discord API](https://discord.com/developers)\n* Hosting - [Vercel](https://vercel.com)"
            }]);

        return interaction.reply({ embeds: [aboutMe, credits] });

    }


}
