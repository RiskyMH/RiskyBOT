import { AnyChannel, EmbedBuilder } from "discord.js";
import type { Client, User, GuildMember } from "discord.js";
import { ChannelType, PermissionFlagsBits } from "discord-api-types/v10";
import * as tools from "@riskybot/tools";
import type { Config, EnvEnabled } from "@riskybot/tools";
import { SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption } from "@discordjs/builders";


//TODO: Make sure everything works...


export default async function say(client: Client, config: Config, user: User, message: string, botMember?: GuildMember, channel?: AnyChannel) {
    let doneEmb = new EmbedBuilder()
        .setColor(config.getColors().ok)
        .setTitle("Done!");

    let errorEmb = new EmbedBuilder().setTitle("Errors - say").setColor(config.getColors().error);
    let errors = [];

    if (!channel || !botMember || channel.type === ChannelType.DM) {
        errors.push("This command doesn't work in `DMs`");
    } else if (!botMember.permissions.has(PermissionFlagsBits.ManageWebhooks)) {
        errors.push("This bot doesn't have permissions to to this (`MANAGE_WEBHOOKS`)");
    }
    else if (channel.isThread() || !channel.isTextBased()) {
        errors.push("This command doesn't work in `threads`");
    }


    if (!errors.length && channel && client?.user && botMember) {
        const webhook = await tools.webhookMakeOrFind(
            // @ts-expect-error This is should be a valid webhook channel
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

export function applicationCommands(config?: Config, envEnabledList?: EnvEnabled) {
    config; envEnabledList; // Just so it is used
    let searchSlashCommand = new SlashCommandBuilder()
        .setName("say")
        .setDescription("Send a message in a channel as yourself or someone else")
        .setDMPermission(false)
        .addStringOption(
            new SlashCommandStringOption()
                .setName("message")
                .setDescription("What will be sent in the channel")
                .setRequired(true)
        )
        .addUserOption(
            new SlashCommandUserOption()
                .setName("user")
                .setDescription("The user that will be simulated")
                .setRequired(true)
        );
    return [searchSlashCommand];
}