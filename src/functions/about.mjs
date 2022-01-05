import {time, hyperlink,inlineCode, userMention, bold, codeBlock} from "@discordjs/builders";
import { MessageEmbed, Permissions } from "discord.js";
import fetch from "node-fetch";
import { redditAutoComplete, reddit } from "./defaults.mjs";

/**
 * @param {import("discord.js").Client} client
 * @param {import("../types").ConfigJSON } config
 * @param { import("discord.js").CommandInteractionOption } option
 * @param {string} extra
 * @param {string} topggKey
 * @return {Promise <import("discord.js").InteractionReplyOptions>}
 */

export default async function about(client,config,option,extra,topggKey = "") {

    let aboutEmbed = new MessageEmbed().setColor(config.colors.ok);
    let aboutEmbedExtra = new MessageEmbed().setColor(config.colors.ok);

    // USER
    if (option.user) {
        aboutEmbed
            .setTitle(
                "About - " + inlineCode("User:") + bold(inlineCode(option.user.username))
            )
            .setThumbnail(option.user.avatarURL())
            .addField(
                "Made",
                time(new Date(option.user.createdAt)) +
                " (" +
                time(option.user.createdAt, "R") +
                ")"
            )
            .addFields(
                { name: "Username", value: codeBlock(option.user.username), inline: true },
                {
                    name: "Discriminator",
                    value: codeBlock(option.user.discriminator),
                    inline: true,
                },
                { name: "Full", value: codeBlock(option.user.tag), inline: true }
            );
        if (option.user.banner) aboutEmbed.setImage(option.user?.bannerURL());
        if (option.user.flags?.toArray().length)
            aboutEmbed.addField(
                "Badges",
                option.user.flags
                    .toArray()
                    .map((e) => flagsEmoji[e])
                    .join("  ")
            );

        if (extra === "advanced") {
            aboutEmbedExtra
                .setTitle(
                    "About - " +
                    inlineCode("User:") +
                    bold(inlineCode(option.user.username)) +
                    inlineCode("(advanced)")
                )
                .addField("Default Avatar URL", option.user.defaultAvatarURL)
                .addField(
                    "Banner URL",
                    hyperlink(
                        "https://cdn.discordapp.com/avatars/...",
                        option.user.displayAvatarURL()
                    )
                );
            if (option.user.banner)
                aboutEmbedExtra.addField(
                    "Current Avatar URL",
                    hyperlink(
                        "https://cdn.discordapp.com/banners/...",
                        option.user.bannerURL()
                    )
                );
            aboutEmbedExtra.addField("ID", codeBlock(option.user.id));

        } else if (extra === "top.gg") {
            if (topggKey) {
                let data = await topgg(option.user, topggKey);
                // @ts-expect-error - error not in type
                if ((await data.bots.error?.toLowerCase()) === "not found") {
                    aboutEmbedExtra
                        .setTitle(
                            "About - " +
                            inlineCode("user/bot:") +
                            bold(inlineCode(option.user.username)) +
                            inlineCode("(Top.gg)")
                        )
                        .addField(
                            "Not found",
                            "Not in top.gg\n• *Note: not all bots and users are on [top.gg](https://top.gg)*"
                        )
                        .setColor(config.colors.warning);
                } else {
                    if (option.user.bot) {
                        aboutEmbedExtra
                            .setTitle(
                                "About - " +
                                inlineCode("Bot:") +
                                bold(inlineCode(option.user.username)) +
                                inlineCode("(Top.gg)")
                            )
                            .setURL("https://top.gg/bot/" + data.bots.id)
                            .addField(
                                "Links",
                                `• [invite](${data.bots.invite})\n• [website](${data.bots.website})`
                            )
                            .addField("Tags", data.bots.tags?.join(", ") ?? "*No tags*")
                            .addField("Short Desc", data.bots.shortdesc ?? "*No description*")
                            .addField("Information",`• Prefix: ${inlineCode(data.bots.prefix ?? "*None*")}\n• Votes: ${inlineCode(data.bots?.points.toLocaleString() ?? "*None*")} (Month: ${inlineCode(data.bots?.monthlyPoints.toLocaleString() ?? "*None*")})\n• Server count: ${inlineCode(data.bots?.server_count?.toString() ?? "*None*") ||"*Not specified*"}`);
                        // @ts-expect-error - bannerUrl not official
                        if (await data.bots.bannerUrl) aboutEmbedExtra.setThumbnail(await data.bots.bannerUrl);
                    } else {
                        aboutEmbedExtra
                            .setTitle(
                                "About - " +
                                inlineCode("User:") +
                                bold(inlineCode(option.user.username)) +
                                inlineCode("(Top.gg)")
                            )
                            .addField("Bio", data.users.bio ?? "*No bio*");
                    }
                }
            } else {
                aboutEmbedExtra
                    .setTitle(
                        "About - " +
                        inlineCode("user/bot:") +
                        bold(inlineCode(option.user.username)) +
                        inlineCode("(Top.gg)")
                    )
                    .setDescription("top.gg part disabled")
                    .setColor(config.colors.warning);
            }
        }
    }
    // MEMBER
    if (option.member) {
        aboutEmbed
            // @ts-expect-error - using types that isn't existing (vscode)
            .setTitle("About - " +inlineCode("User:") +bold(inlineCode(option.member?.nick ?? option.user.username)))
            .addFields([
                {
                    name: "Joined at", // @ts-expect-error - using types that isn't existing (vscode)
                    value: time(new Date(option.member?.joined_at ?? option.member.joinedAt)),
                    inline: true,
                },
                {
                    name: "Server nickname", // @ts-expect-error - using types that isn't existing (vscode)
                    value: option.member.nick? inlineCode(option.member.nick): "*No nickname set*",
                    inline: true,
                },
            ]);
        // @ts-expect-error - using types that isn't existing (vscode)
        if (option.member?.communicationDisabledUntilTimestamp) aboutEmbedExtra.addField("communication_disabled_until",time(new Date(option.member.communicationDisabledUntilTimestamp)));

        if (extra === "advanced") {
            aboutEmbedExtra
                // @ts-expect-error - using types that isn't existing (vscode)
                .setTitle("About - " +inlineCode("User:") +bold(inlineCode(option.member?.nick ?? option.user.username)) +inlineCode("(advanced)"));

            // @ts-expect-error - using types that isn't existing (vscode)
            if (!option.member.guild) aboutEmbedExtra.addFields(await permissionViewer(new Permissions(option.member.permissions)));
        }
        // ROLE
    } else if (option.role) {
        aboutEmbed.setTitle(
            "About - " + inlineCode("Role:") + bold(inlineCode(option.role.name))
        );
        // @ts-expect-error - using types that isn't existing (vscode)
        // .addField("Permissions", option.role.permissions ? (new Permissions(option.role.permissions).toArray().length ? codeBlock((new Permissions(option.role.permissions).toArray().join(", "))) : "*No permissions*") : "*No permissions*")
        aboutEmbed.addFields(await permissionViewer(new Permissions(option.role.permissions)))
                  .addField("Position", codeBlock(option.role.position.toString()));

        // @ts-expect-error - using types that isn't existing (vscode)
        if (option.role.tags?.bot_id ?? option.role.tags?.botId) aboutEmbed.addField("Bot role",userMention(option.role.tags?.bot_id ?? option.role.tags?.botId));

        if (extra === "advanced") {
            aboutEmbedExtra
                .setTitle("About - " +inlineCode("Role:") +bold(inlineCode(option.role.name)) +inlineCode("(advanced)"))
                .addField("ID", codeBlock(option.role.id))
                .addField("Notes", `Pinned in the user listing: \`${option.role.hoist}\``);
        }
    } else if (option.channel) {
        aboutEmbed.setTitle(
            "About - " + inlineCode("Channel:") + bold(inlineCode(option.channel.name))
        );
        // permissions for user
        //  if (option.channel.permissions) aboutEmbed.addFields(await permissionViewer(new Permissions(option.channel.permissions)))
        aboutEmbed.addField("Type",channelTypeEmoji[option.channel.type] ||channelTypeEmojiAlt[option.channel.type]);

        if (extra === "advanced") {
            aboutEmbedExtra
                .setTitle("About - " +inlineCode("Channel:") +bold(inlineCode(option.channel.name)) +inlineCode("(advanced)"))
                .addField("ID", codeBlock(option.channel.id));
        }
    }
    if (option.name === "id") {
        let anyId = option.value.toString();

        var timestampFromSnowflake = (id) => {
            return Number(id) / 4194304 + 1420070400000;
        };
        let list = [];
        for (let str in channelTypeEmoji) {
            list.push(channelTypeEmoji[str]);
        }
        aboutEmbed
            .setTitle("About - " + inlineCode("id:") + bold(inlineCode(anyId)))
            .setDescription("*Because this is only the ID, limited information*")
            .addField("Made", time(new Date(timestampFromSnowflake(anyId))))
            .addField("emoji", list.toLocaleString());

        if (extra === "advanced") {
            aboutEmbedExtra
                .setTitle("About - " +inlineCode("id:") +bold(inlineCode(anyId)) +inlineCode("(advanced)"))
                .addField("ID", codeBlock(anyId));
        }
    }
    if (option.name === "sub-reddit") {
        return await reddit(client,"subreddit",option.value.toString(),config.colors.ok,config.colors.error);
    }

    if (!extra) return { embeds: [aboutEmbed] };
    else return { embeds: [aboutEmbed, aboutEmbedExtra] };
}

/**
 * @param {import("discord.js").Client} client
 * @param {string} input
 * @param { string } type
 * @return { Promise <import("discord.js").ApplicationCommandOptionChoice[]> }
 */
export async function autoComplete(client, type, input) {
    try {
        /** @type Object */

        switch (type) {
            case "subreddit": {
                return await redditAutoComplete(client, "sub-reddit", input);
            }
        }
    } catch { console.log;}
}
const flagsEmoji = {
    HYPESQUAD_EVENTS: "<:HypeSquadEvents:899099369742155827>",
    BUGHUNTER_LEVEL_2: "<:BugHunterLevel2:899099369767313429>",
    BUGHUNTER_LEVEL_1: "<:BugHunterLevel1:899099369989615616>",
    EARLY_SUPPORTER: "<:EarlySupporter:899099370056724500>",
    HOUSE_BALANCE: "<:HouseBalance:899099370069319680>",
    DISCORD_CERTIFIED_MODERATOR: "<:DiscordCertifiedModerator:899099370077716480>",
    HOUSE_BRILLIANCE: "<:HouseBrilliance:899099370090295367>",
    DISCORD_EMPLOYEE: "<:DiscordEmployee:899099370161586217>",
    HOUSE_BRAVERY: "<:HouseBravery:899099370186760213>",
    EARLY_VERIFIED_BOT_DEVELOPER:
        "<:EarlyVerifiedBotDeveloper:899099370190946354>",
    VERIFIED_BOT: "<:VerifiedBot:899099370228695130>",
    TEAM_USER: "<:TeamUser:899099370232889364>",
    PARTNERED_SERVER_OWNER: "<:PartneredServerOwner:899099370396450827>",
};

const channelTypeEmoji = {
    GUILD_TEXT: "<:ChannelText:779036156175188001> Text channel",
    DM: "<:IconMembers:778932116024459275> DM channel",
    GUILD_VOICE: "<:ChannelVC:779036156607332394> Voice channel",
    GROUP_DM: "<:IconMembers:778932116024459275> Group DM channel",
    GUILD_CATEGORY: "<:ChannelCategory:816771723264393236> Category for channels",
    GUILD_NEWS: "<:ChannelAnnouncements:779042577114202122> News Channel (announcements)",
    GUILD_STORE: "<:ChannelStore:829073795041067098> Store Channel",
    GUILD_NEWS_THREAD:"<:ChannelAnnouncementThread:897572964508266506> Thread in news channel",
    GUILD_PUBLIC_THREAD: "<:ChannelThread:842224626486607872> Thread in channel",
    GUILD_PRIVATE_THREAD: "<:ChannelThreadPrivate:842224739275898921> Thread in channel (private)",
    GUILD_STAGE_VOICE: "<:StagePublic:829073837538410556> Stage channel",
};
const channelTypeEmojiAlt = {
    0: channelTypeEmoji.GUILD_TEXT,
    1: channelTypeEmoji.DM,
    2: channelTypeEmoji.GUILD_VOICE,
    3: channelTypeEmoji.GROUP_DM,
    4: channelTypeEmoji.GUILD_CATEGORY,
    5: channelTypeEmoji.GUILD_NEWS,
    6: channelTypeEmoji.GUILD_STORE,
    10: channelTypeEmoji.GUILD_NEWS_THREAD,
    11: channelTypeEmoji.GUILD_PUBLIC_THREAD,
    12: channelTypeEmoji.GUILD_PRIVATE_THREAD,
    13: channelTypeEmoji.GUILD_STAGE_VOICE,
};

/**
 * @param {import("discord.js").Permissions} permissions
 * @return {Promise<import("discord.js").EmbedFieldData[]>}
 */
async function permissionViewer(permissions) {
    let emojis = {
        none: "<:CheckNone:900615195209138186>",
        off: "<:CheckOff:900615195154612276>",
        on: "<:CheckOn:900615194936475659>",
    };

    let listGeneral = [];
    if (permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        listGeneral.push(emojis.on + " Administrator");
    } else listGeneral.push(emojis.off + " Administrator");
    if (permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) {
        listGeneral.push(emojis.on + " View Audit Log");
    } else listGeneral.push(emojis.off + " View Audit Log");
    if (permissions.has(Permissions.FLAGS.VIEW_GUILD_INSIGHTS)) {
        listGeneral.push(emojis.on + " View Server Insights");
    } else listGeneral.push(emojis.off + " View Server Insights");
    if (permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        listGeneral.push(emojis.on + " Manage Server");
    } else listGeneral.push(emojis.off + " Manage Server");
    if (permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
        listGeneral.push(emojis.on + " Manage Roles");
    } else listGeneral.push(emojis.off + " Manage Roles");
    if (permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
        listGeneral.push(emojis.on + " Manage Channels");
    } else listGeneral.push(emojis.off + " Manage Channels");
    if (permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
        listGeneral.push(emojis.on + " Kick Members");
    } else listGeneral.push(emojis.off + " Kick Members");
    if (permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
        listGeneral.push(emojis.on + " Ban Members");
    } else listGeneral.push(emojis.off + " Ban Members");
    if (permissions.has(Permissions.FLAGS.CREATE_INSTANT_INVITE)) {
        listGeneral.push(emojis.on + " Create Instant Invite");
    } else listGeneral.push(emojis.off + " Create Instant Invite");
    if (permissions.has(Permissions.FLAGS.CHANGE_NICKNAME)) {
        listGeneral.push(emojis.on + " Change Nickname");
    } else listGeneral.push(emojis.off + " Change Nickname");
    if (permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) {
        listGeneral.push(emojis.on + " Manage Nicknames");
    } else listGeneral.push(emojis.off + " Manage Nicknames");
    if (permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)) {
        listGeneral.push(emojis.on + " Manage Emojis/Stickers");
    } else listGeneral.push(emojis.off + " Manage Emojis/Stickers");
    if (permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS)) {
        listGeneral.push(emojis.on + " Manage Webhooks");
    } else listGeneral.push(emojis.off + " Manage Webhooks");
    if (permissions.has(Permissions.FLAGS.VIEW_CHANNEL))
        listGeneral.push(emojis.on + " View Channels");
    else listGeneral.push(emojis.off + " View Channels");
    if (permissions.has(Permissions.FLAGS.MANAGE_EVENTS))
        listGeneral.push(emojis.on + " Manage Events");
    else listGeneral.push(emojis.off + " Manage Events");
    if (permissions.has(Permissions.FLAGS.MODERATE_MEMBERS))
        listGeneral.push(emojis.on + " Moderate Members");
    else listGeneral.push(emojis.off + " Moderate Members");

    let listText = [];
    if (permissions.has(Permissions.FLAGS.SEND_MESSAGES)) {
        listText.push(emojis.on + " Send Messages");
    } else listText.push(emojis.off + " Send Messages");
    if (permissions.has(Permissions.FLAGS.CREATE_PUBLIC_THREADS))
        listText.push(emojis.on + " Create Public Threads");
    else listText.push(emojis.off + " Create Public Threads");
    if (permissions.has(Permissions.FLAGS.CREATE_PRIVATE_THREADS))
        listText.push(emojis.on + " Create Private Threads");
    else listText.push(emojis.off + " Create Private Threads");
    if (permissions.has(Permissions.FLAGS.SEND_MESSAGES_IN_THREADS))
        listText.push(emojis.on + " Send Messages in Threads");
    else listText.push(emojis.off + " Send Messages in Threads");
    if (permissions.has(Permissions.FLAGS.SEND_TTS_MESSAGES))
        listText.push(emojis.on + " Send TTS Messages");
    else listText.push(emojis.off + " Send TTS Messages");
    if (permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
        listText.push(emojis.on + " Manage Messages");
    else listText.push(emojis.off + " Manage Messages");
    if (permissions.has(Permissions.FLAGS.MANAGE_THREADS))
        listText.push(emojis.on + " Manage Threads");
    else listText.push(emojis.off + " Manage Threads");
    if (permissions.has(Permissions.FLAGS.EMBED_LINKS))
        listText.push(emojis.on + " Embed Links");
    else listText.push(emojis.off + " Embed Links");
    if (permissions.has(Permissions.FLAGS.ATTACH_FILES))
        listText.push(emojis.on + " Embed Files");
    else listText.push(emojis.off + " Embed Files");
    if (permissions.has(Permissions.FLAGS.READ_MESSAGE_HISTORY))
        listText.push(emojis.on + " Read Message History");
    else listText.push(emojis.off + " Read Message History");
    if (permissions.has(Permissions.FLAGS.MENTION_EVERYONE))
        listText.push(emojis.on + " Mention Everyone");
    else listText.push(emojis.off + " Mention Everyone");
    if (permissions.has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS))
        listText.push(emojis.on + " Use External Emojis");
    else listText.push(emojis.off + " Use External Emojis");
    if (permissions.has(Permissions.FLAGS.USE_EXTERNAL_STICKERS))
        listText.push(emojis.on + " Use External Stickers");
    else listText.push(emojis.off + " Use External Stickers");
    if (permissions.has(Permissions.FLAGS.ADD_REACTIONS))
        listText.push(emojis.on + " Add Reactions");
    else listText.push(emojis.off + " Add Reactions");
    if (permissions.has(Permissions.FLAGS.USE_APPLICATION_COMMANDS))
        listText.push(emojis.on + " Use Slash Commands");
    else listText.push(emojis.off + " Use Slash Commands");

    let listVoice = [];
    if (permissions.has(Permissions.FLAGS.CONNECT))
        listVoice.push(emojis.on + " Connect");
    else listVoice.push(emojis.off + " Connect");
    if (permissions.has(Permissions.FLAGS.SPEAK))
        listVoice.push(emojis.on + " Speak");
    else listVoice.push(emojis.off + " Speak");
    if (permissions.has(Permissions.FLAGS.MUTE_MEMBERS))
        listVoice.push(emojis.on + " Mute Members");
    else listVoice.push(emojis.off + " Mute Members");
    if (permissions.has(Permissions.FLAGS.DEAFEN_MEMBERS))
        listVoice.push(emojis.on + " Deafen Members");
    else listVoice.push(emojis.off + " Deafen Members");
    if (permissions.has(Permissions.FLAGS.MOVE_MEMBERS))
        listVoice.push(emojis.on + " Move Members");
    else listVoice.push(emojis.off + " Move Members");
    if (permissions.has(Permissions.FLAGS.USE_VAD))
        listVoice.push(emojis.on + " Use Voice Activity");
    else listVoice.push(emojis.off + " Use Voice Activity");
    if (permissions.has(Permissions.FLAGS.PRIORITY_SPEAKER))
        listVoice.push(emojis.on + " Priory Speaker");
    else listVoice.push(emojis.off + " Priory Speaker");

    return [
        { name: "General Permissions", value: listGeneral.join("\n"), inline: true },
        { name: "Test Permissions", value: listText.join("\n"), inline: true },
        { name: "Voice Permissions", value: listVoice.join("\n"), inline: true },
    ];
}

const topggBaseUrl = "https://top.gg/api";

async function topgg(user, topggKey) {

    let headersGG = {
        Authorization: topggKey,
        "Content-Type": "application/json",
    };
    /** @typedef {import("../types").topggapiResponse} topgg */
    /**@type {object} */
    let data = await fetch(
        topggBaseUrl + (user.bot ? "/bots/" : "/users/") + user.id,
        { headers: headersGG }
    ).then((response) => response.json());

    /**@type {topgg} */
    let topggdata = {};
    topggdata.bots = data;
    topggdata.users = data;

    return topggdata;
}
