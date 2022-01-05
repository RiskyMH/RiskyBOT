import { MessageEmbed } from "discord.js";
import * as tools from "../tools.mjs";

/**
 * @param {import("discord.js").Client} client
 * @param {string} message
 * @param {import("discord.js").ColorResolvable} colorGoo
 * @param {import("discord.js").ColorResolvable} colorErr
 * @param {import("discord.js").User} user
 * @param {import("discord.js").Permissions} permissions
 * @param {import("discord.js").BaseGuildTextChannel} channel
 * @return {Promise <import("discord.js").InteractionReplyOptions>}
 */

export default async function say(client, message, colorGoo, colorErr, user, permissions, channel) {
    let doneEmb = new MessageEmbed()
        .setColor(colorGoo)
        .setTitle("Done!");

    let errorEmb = new MessageEmbed().setTitle("Errors - say").setColor(colorErr);
    let errors = [];

    if (!channel) {
        errors.push("This command doesn't work in `DMs`");
    } else if (!permissions.has("MANAGE_WEBHOOKS")) {
        errors.push("This bot doesn't have permissions to to this (`MANAGE_WEBHOOKS`)");
    }
    if (channel.isThread()) {
        errors.push("This command doesn't work in `threads`");
    }


    if (!errors.length) {
        const webhook = await tools.webhookMakeOrFind(
            channel,
            client.user.username,
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
