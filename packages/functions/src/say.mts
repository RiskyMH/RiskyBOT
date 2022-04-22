// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// //  @ts-nocheck

import { EmbedBuilder } from "discord.js";
import type {BaseGuildTextChannel, Client, User, GuildMember } from "discord.js";
import 
{ PermissionFlagsBits } from "discord-api-types/v10";
import tools from "@riskybot/tools";
import type { Config } from "@riskybot/tools";


export default async function say(client: Client, config: Config, user: User, message: string, botMember?: GuildMember, channel?: BaseGuildTextChannel) {
    let doneEmb = new EmbedBuilder()
        .setColor(config.getColors().ok)
        .setTitle("Done!");

    let errorEmb = new EmbedBuilder().setTitle("Errors - say").setColor(config.getColors().error);
    let errors = [];

    if (!channel || !botMember || channel.isDM()) {
        errors.push("This command doesn't work in `DMs`");
    } else if (!botMember.permissions.has(PermissionFlagsBits.ManageWebhooks)) {
        errors.push("This bot doesn't have permissions to to this (`MANAGE_WEBHOOKS`)");
    }
    else if (channel.isThread() || !channel.isTextBased()) {
        errors.push("This command doesn't work in `threads`");
    }


    if (!errors.length && channel && client?.user ) {
        const webhook = await tools.webhookMakeOrFind(
            channel,
            client.user.username ?? "RiskyBOT",
            client.user.id
        );
        await webhook.send({
            content: message,
            username: user.username,
            avatarURL: user.displayAvatarURL(),
        });

        return {
            embeds: [doneEmb.setDescription("Sent message in this channel")],
            ephemeral: true,
        };
    } else {
        errorEmb.setDescription("• " + errors.join("\n• "));

        return { embeds: [errorEmb], ephemeral: true };
    }
}
