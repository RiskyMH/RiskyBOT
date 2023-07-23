import { ContextMenuCommandBuilder, EmbedBuilder, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandRoleOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { codeBlock, inlineCode, roleMention, time } from "@discordjs/formatters";
import Command from "@riskybot/command";
import { ApplicationCommandInteraction, AutocompleteInteraction, Permissions, UserFlags } from "discord-api-parser";
import { env } from "#env.mjs";
import { APIEmbedField, ApplicationCommandType, ChannelType, ImageFormat, PermissionFlagsBits, UserFlags as UserFlagsEnum } from "discord-api-types/v10";
import config from "#config.mjs";
import { reddit, topgg } from "@riskybot/apis";
import { listFormatter, resolveHexColor, trim } from "@riskybot/tools";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { autoComplete as redditAutocomplete } from "./_reddit.mjs";


export default class About extends Command {
    name = "about";
    description = "Replies with information about a user/role";

    command = (() => {
        const userAboutOptions = [{ name: "Advanced", value: "advanced" }];
        if (env.TOPGG_TOKEN) userAboutOptions.push({ name: "Top.gg", value: "top.gg" });

        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addSubcommand(
                new SlashCommandSubcommandBuilder()
                    .setName("user")
                    .setDescription("Replies with information about a user")
                    .addUserOption(
                        new SlashCommandUserOption()
                            .setName("user")
                            .setRequired(true)
                            .setDescription("The user to get information about")
                    ).addStringOption(
                        new SlashCommandStringOption()
                            .setName("extra")
                            .setDescription("Some more information that isn't as useful")
                            .addChoices(...userAboutOptions)
                    )
            ).addSubcommand(
                new SlashCommandSubcommandBuilder()
                    .setName("role")
                    .setDescription("Replies with information about a role")
                    .addRoleOption(
                        new SlashCommandRoleOption()
                            .setName("role")
                            .setRequired(true)
                            .setDescription("The role to get information about")
                    ).addStringOption(
                        new SlashCommandStringOption()
                            .setName("extra")
                            .setDescription("Some more information that isn't as useful")
                            .addChoices(
                                { name: "Advanced", value: "advanced" }
                            )
                    )
            ).addSubcommand(
                new SlashCommandSubcommandBuilder()
                    .setName("channel")
                    .setDescription("Replies with information about a channel")
                    .addChannelOption(
                        new SlashCommandChannelOption()
                            .setName("channel")
                            .setRequired(true)
                            .setDescription("The channel to get information about")
                    ).addStringOption(
                        new SlashCommandStringOption()
                            .setName("extra")
                            .setDescription("Some more information that isn't as useful")
                            .addChoices(
                                { name: "Advanced", value: "advanced" }
                            )
                    )
            ).addSubcommand(
                new SlashCommandSubcommandBuilder()
                    .setName("subreddit")
                    .setDescription("Get information about a subreddit")
                    .addStringOption(
                        new SlashCommandStringOption()
                            .setName("subreddit")
                            .setDescription("The name of the subreddit")
                            .setRequired(true)
                            .setAutocomplete(true)
                    )
            );
    })();

    userCommandName = "About user";

    userCommand = new ContextMenuCommandBuilder()
        .setName(this.userCommandName)
        .setType(ApplicationCommandType.User);


    async handleApplicationCommand(interaction: ApplicationCommandInteraction) {
        // Must be from a slash command (should always be anyway)
        // if (!interaction.isChatInputCommand()) return;

        // can be from slash command or context menu (user)
        // can be user, role, or channel

        // the code for the slash command and context menu is the same

        const type =
            interaction.isChatInputCommand()
                ? interaction.options.getSubcommand(true)
                : interaction.isUserCommand()
                    ? "user"
                    : undefined;
        if (!type) {
            throw new Error("Invalid interaction type");
        }

        const extra = interaction.isChatInputCommand() && interaction.options.getString("extra");

        switch (type) {
            case "user": {
                const user = interaction.isChatInputCommand()
                    ? interaction.options.getUser("user", true)
                    : interaction.isUserCommand()
                        ? interaction.targetUser
                        : undefined;

                if (!user) {
                    throw new Error("Invalid user");
                }

                const member = interaction.isChatInputCommand()
                    ? interaction.options.getMember("user")
                    : interaction.isUserCommand()
                        ? interaction.targetMember
                        : undefined;

                const userAvatar = user.avatarURL({ extension: ImageFormat.PNG, size: 512 });

                const embed = new EmbedBuilder()
                    .setColor(config.colors.ok)
                    .setAuthor({
                        name: "@" + user.username,
                        iconURL: user.displayAvatarURL(),
                        url: "https://discord.com/users/" + user.id
                    })
                    .addFields([{
                        name: "Made",
                        value: `${time(user.createdAt)} (${time(user.createdAt, "R")})`
                    }])
                    .setThumbnail(userAvatar);

                if (user.banner) {
                    embed.setImage(user.bannerURL({ extension: ImageFormat.PNG, size: 512 }));
                }

                if (user.publicFlags?.isEmpty() === false) {
                    embed.setDescription(userFlagsMapper(user.publicFlags).join("  ") || null);
                }

                if (member) {
                    embed
                        .setThumbnail(member.memberAvatarURL({ extension: ImageFormat.PNG, size: 512 }) || userAvatar)
                        .addFields([
                            {
                                name: "Joined at",
                                value: time(member.joinedAt),
                                inline: true,
                            },
                            {
                                name: "Server nickname",
                                value: member.nickname ? inlineCode(member.nickname) : "*No nickname set*",
                                inline: true,
                            },
                        ]);


                    if (member.roles.length) {
                        embed.addFields([{ name: "Roles", value: member.roles.map((e) => (roleMention(e))).join(" ") }]);
                    }

                    if (member.communicationDisabledUntil) {
                        embed.addFields([{
                            name: "Time out until",
                            value: time(new Date(member.communicationDisabledUntil))
                        }]);
                    }
                }

                if (extra === "advanced") {
                    const extraEmbed = new EmbedBuilder()
                        .setTitle("Advanced info")
                        .setColor(config.colors.ok)
                        .addFields([{ name: "ID", value: codeBlock(user.id) }])
                        .addFields([{ name: "Default Avatar URL", value: user.defaultAvatarURL }])
                        .addFields([{ name: "Current Avatar URL", value: user.displayAvatarURL() }]);

                    if (user.banner) extraEmbed.addFields([{ name: "Banner URL", value: user.bannerURL() || "" }]);

                    if (member) {
                        if (member.avatar) {
                            extraEmbed.addFields([{ name: "Member Avatar URL", value: member.memberAvatarURL() || "" }]);
                        }

                        if (member.permissions) {
                            extraEmbed.addFields(permissionViewer(member.permissions));
                        }

                    }

                    return interaction.reply({ embeds: [embed, extraEmbed] });
                }

                else if (extra === "top.gg") {
                    const extraEmbed = new EmbedBuilder()
                        .setTitle("Top.gg advanced info")
                        .setColor(config.colors.ok);

                    if (!env.TOPGG_TOKEN) {
                        extraEmbed
                            .setDescription("top.gg part disabled")
                            .setColor(config.colors.warning);

                        return interaction.reply({ embeds: [embed, extraEmbed] });
                    }

                    if (user.bot) {
                        const data = await topgg.botInfo(user.id, env.TOPGG_TOKEN);
                        if (!data) {
                            extraEmbed
                                .addFields([{
                                    name: "Not found",
                                    value: "Not in top.gg\n• *Note: not all bots and users are on [top.gg](https://top.gg)*"
                                }])
                                .setColor(config.colors.warning);

                            return interaction.reply({ embeds: [embed, extraEmbed] });
                        }

                        extraEmbed
                            .setURL("https://top.gg/bot/" + data.id)
                            .addFields([{ name: "Links", value: `• [invite](${data.invite})\n• [website](${data.website})` }])
                            .addFields([{ name: "Tags", value: listFormatter.format(data.tags) ?? "*No tags*" }])
                            .addFields([{ name: "Short Desc", value: data.shortdesc ?? "*No description*" }])
                            // .addFields([{ name: "Information", value: `• Prefix: ${inlineCode(data.prefix ?? "*None*")}\n• Votes: ${inlineCode(data?.points.toLocaleString() ?? "*None*")} (Month: ${inlineCode(data?.monthlyPoints.toLocaleString() ?? "*None*")})\n• Server count: ${inlineCode(data?.server_count?.toString() ?? "*None*") || "*Not specified*"}` }]);
                            .addFields([{
                                name: "Information",
                                value: [
                                    `* Prefix: ${inlineCode(data.prefix ?? "*None*")}`,
                                    `* Votes: ${inlineCode(data?.points.toLocaleString() ?? "*None*")} (Month: ${inlineCode(data?.monthlyPoints.toLocaleString() ?? "*None*")})`,
                                    `* Server count: ${inlineCode(data?.server_count?.toString() ?? "*None*") || "*Not specified*"}`
                                ].join("\n")
                            }]);

                        if (data.bannerUrl) extraEmbed.setImage(data.bannerUrl);

                        return interaction.reply({ embeds: [embed, extraEmbed] });


                    } else {
                        const data = await topgg.userInfo(user.id, env.TOPGG_TOKEN);
                        if (!data) {
                            extraEmbed
                                .addFields([{
                                    name: "Not found",
                                    value: "Not in top.gg\n• *Note: not all bots and users are on [top.gg](https://top.gg)*"
                                }])
                                .setColor(config.colors.warning);

                            return interaction.reply({ embeds: [embed, extraEmbed] });
                        }

                        extraEmbed.addFields([{ name: "Bio", value: data.bio ?? "*No bio*" }]);
                        if (data.banner) extraEmbed.setImage(data.banner);

                        return interaction.reply({ embeds: [embed, extraEmbed] });
                    }

                }

                // finally return embed (if not extra)
                return interaction.reply({ embeds: [embed] });
            }

            case "channel": {
                // Should always be a slash command
                if (!interaction.isChatInputCommand()) return;
                const channel = interaction.options.getChannel("channel", true);


                const embed = new EmbedBuilder()
                    .setTitle("#" + channel.name)
                    .setColor(config.colors.ok)
                    .addFields([{ name: "Type", value: channelEmoji[channel.type] }])
                    .addFields([{ name: "Created at", value: time(new Date(DiscordSnowflake.timestampFrom(channel.id))) }]);

                if (extra === "advanced") {
                    const extraEmbed = new EmbedBuilder()
                        .setTitle("Advanced info")
                        .setColor(config.colors.ok)
                        .addFields([{ name: "ID", value: codeBlock(channel.id) }]);
                    return interaction.reply({ embeds: [embed, extraEmbed] });
                }

                // finally return embed (if not extra)
                return interaction.reply({ embeds: [embed] });
            }

            case "role": {
                // Should always be a slash command
                if (!interaction.isChatInputCommand()) return;
                const role = interaction.options.getRole("role", true);

                const embed = new EmbedBuilder()
                    .setTitle("@" + role.name)
                    .setColor(config.colors.ok)
                    .addFields([{ name: "Created at", value: time(new Date(DiscordSnowflake.timestampFrom(role.id))) }])
                    .addFields([{ name: "Color", value: resolveHexColor(role.color) }])
                    .addFields(permissionViewer(role.permissions))
                    .addFields([{ name: "Position", value: role.position.toString() }]);

                if (extra === "advanced") {
                    const extraEmbed = new EmbedBuilder()
                        .setTitle("Advanced info")
                        .setColor(config.colors.ok)
                        .addFields([{ name: "ID", value: codeBlock(role.id) }]);
                    return interaction.reply({ embeds: [embed, extraEmbed] });
                }

                // finally return embed (if not extra)
                return interaction.reply({ embeds: [embed] });

            }

            case "subreddit": {
                // Should always be a slash command
                if (!interaction.isChatInputCommand()) return;

                const subreddit = interaction.options.getString("subreddit", true)
                    .replace("r/", "");

                const info = await reddit.subredditInfo(subreddit);

                if (!info) {
                    const errorEmb = new EmbedBuilder()
                        .setColor(config.colors.error)
                        .setTitle("Can't find your subreddit")
                        .setDescription("No results found for" + inlineCode("r/" + subreddit))
                        .setAuthor({ name: "Reddit", url: "https://www.reddit.com/", iconURL: "https://www.reddit.com/favicon.ico" });

                    return interaction.reply({ embeds: [errorEmb], ephemeral: true });
                }

                const embed = new EmbedBuilder()
                    .setAuthor({ name: "Reddit", url: "https://www.reddit.com/", iconURL: "https://www.reddit.com/favicon.ico" })
                    .setURL(info.url)
                    .setColor(config.colors.ok)
                    .setTitle(info.display_name_prefixed)
                    .setThumbnail(info.community_icon.split("?")[0] || info.icon_img || null)
                    .addFields([{ name: "Title", value: trim(info.title, 1024) }])
                    .addFields([{ name: "Short description", value: trim(info.public_description || "*No description provided*", 1024) }])
                    .addFields([{ name: "Made", value: time(info.created_utc) }])
                    .addFields([{ name: "Stats", value: `\`🧑${info.subscribers.toLocaleString()}\`` }]);

                return interaction.reply({ embeds: [embed] });

            }

        }

        return interaction.reply({ content: "This command is not yet implemented", ephemeral: true });


    }

    async handleAutoComplete(interaction: AutocompleteInteraction) {
        switch (interaction.options.getSubcommand()) {
            case "subreddit": {
                const input = interaction.options.getString("subreddit", true);
                return interaction.respond(await redditAutocomplete(input));
            }

        }
    }


}

const channelEmoji = {
    [ChannelType.DM]: "<:IconMembers:778932116024459275> DM channel",
    [ChannelType.GuildText]: "<:ChannelText:779036156175188001> Text channel",
    [ChannelType.GuildVoice]: "<:ChannelVC:779036156607332394> Voice channel",
    [ChannelType.GroupDM]: "<:IconMembers:778932116024459275> Group DM channel",
    [ChannelType.GuildCategory]: "<:ChannelCategory:816771723264393236> Category for channels",
    [ChannelType.GuildAnnouncement]: "<:ChannelAnnouncements:779042577114202122> News Channel (announcements)",
    [ChannelType.AnnouncementThread]: "<:ChannelAnnouncementThread:897572964508266506> Thread in news channel",
    [ChannelType.PublicThread]: "<:ChannelThread:842224626486607872> Thread in channel",
    [ChannelType.PrivateThread]: "<:ChannelThreadPrivate:842224739275898921> Thread in channel (private)",
    [ChannelType.GuildStageVoice]: "<:StagePublic:829073837538410556> Stage channel",
    [ChannelType.GuildForum]: "Forum Channel",
    [ChannelType.GuildDirectory]: "Directory channel",
};

const userFlagsEmoji = {
    [UserFlagsEnum.Hypesquad]: "<:HypeSquadEvents:899099369742155827>",
    [UserFlagsEnum.BugHunterLevel2]: "<:BugHunterLevel2:899099369767313429>",
    [UserFlagsEnum.BugHunterLevel1]: "<:BugHunterLevel1:899099369989615616>",
    [UserFlagsEnum.PremiumEarlySupporter]: "<:EarlySupporter:899099370056724500>",
    [UserFlagsEnum.CertifiedModerator]: "<:DiscordCertifiedModerator:899099370077716480>",
    [UserFlagsEnum.HypeSquadOnlineHouse3]: "<:HouseBalance:899099370069319680>",
    [UserFlagsEnum.HypeSquadOnlineHouse2]: "<:HouseBrilliance:899099370090295367>",
    [UserFlagsEnum.HypeSquadOnlineHouse1]: "<:HouseBravery:899099370186760213>",
    [UserFlagsEnum.Staff]: "<:DiscordEmployee:899099370161586217>",
    [UserFlagsEnum.VerifiedDeveloper]: "<:EarlyVerifiedBotDeveloper:899099370190946354>",
    [UserFlagsEnum.VerifiedBot]: "<:VerifiedBot:899099370228695130>",
    [UserFlagsEnum.TeamPseudoUser]: "<:TeamUser:899099370232889364>",
    [UserFlagsEnum.Partner]: "<:PartneredServerOwner:899099370396450827>",
    [UserFlagsEnum.BotHTTPInteractions]: "HTTP Interaction BOT",
    [UserFlagsEnum.Quarantined]: "<:Quarantined:899099370109879552>",
    [UserFlagsEnum.ActiveDeveloper]: "Active dev",
};


function userFlagsMapper(flags: UserFlags): string[] {
    if (!flags) return [];

    return Object.entries(userFlagsEmoji)
        .filter(([flag,]) => flags.has(BigInt(flag)))
        .map(([, emoji]) => emoji);
}

const permissionCategories = [
    {
        name: "General Permissions",
        permissions: [
            { name: "Administrator", flag: PermissionFlagsBits.Administrator },
            { name: "View Audit Log", flag: PermissionFlagsBits.ViewAuditLog },
            { name: "View Server Insights", flag: PermissionFlagsBits.ViewGuildInsights },
            { name: "Manage Server", flag: PermissionFlagsBits.ManageGuild },
            { name: "Manage Roles", flag: PermissionFlagsBits.ManageRoles },
            { name: "Manage Channels", flag: PermissionFlagsBits.ManageChannels },
            { name: "Kick Members", flag: PermissionFlagsBits.KickMembers },
            { name: "Ban Members", flag: PermissionFlagsBits.BanMembers },
            { name: "Create Instant Invite", flag: PermissionFlagsBits.CreateInstantInvite },
            { name: "Change Nickname", flag: PermissionFlagsBits.ChangeNickname },
            { name: "Manage Nicknames", flag: PermissionFlagsBits.ManageNicknames },
            { name: "Manage Emojis/Stickers", flag: PermissionFlagsBits.ManageEmojisAndStickers },
            { name: "Manage Webhooks", flag: PermissionFlagsBits.ManageWebhooks },
            { name: "Manage Channels", flag: PermissionFlagsBits.ManageChannels },
            { name: "Manage Events", flag: PermissionFlagsBits.ManageEvents },
            { name: "Moderate Members", flag: PermissionFlagsBits.ModerateMembers },
            { name: "View Channel", flag: PermissionFlagsBits.ViewChannel },
        ],
    },
    {
        name: "Text Permissions",
        permissions: [
            { name: "Send Messages", flag: PermissionFlagsBits.SendMessages },
            { name: "Create Public Threads", flag: PermissionFlagsBits.CreatePublicThreads },
            { name: "Create Private Threads", flag: PermissionFlagsBits.CreatePrivateThreads },
            { name: "Send Messages in Threads", flag: PermissionFlagsBits.SendMessagesInThreads },
            { name: "Send TTS Messages", flag: PermissionFlagsBits.SendTTSMessages },
            { name: "Manage Messages", flag: PermissionFlagsBits.ManageMessages },
            { name: "Manage Threads", flag: PermissionFlagsBits.ManageThreads },
            { name: "Embed Links", flag: PermissionFlagsBits.EmbedLinks },
            { name: "Attach Files", flag: PermissionFlagsBits.AttachFiles },
            { name: "Read Message History", flag: PermissionFlagsBits.ReadMessageHistory },
            { name: "Mention Everyone", flag: PermissionFlagsBits.MentionEveryone },
            { name: "Use External Emojis", flag: PermissionFlagsBits.UseExternalEmojis },
            { name: "Use External Stickers", flag: PermissionFlagsBits.UseExternalStickers },
            { name: "Add Reactions", flag: PermissionFlagsBits.AddReactions },
            { name: "Use Slash Commands", flag: PermissionFlagsBits.UseApplicationCommands },
        ],
    },
    {
        name: "Voice Permissions",
        permissions: [
            { name: "Connect", flag: PermissionFlagsBits.Connect },
            { name: "Speak", flag: PermissionFlagsBits.Speak },
            { name: "Mute Members", flag: PermissionFlagsBits.MuteMembers },
            { name: "Deafen Members", flag: PermissionFlagsBits.DeafenMembers },
            { name: "Move Members", flag: PermissionFlagsBits.MoveMembers },
            { name: "Use Voice Activity", flag: PermissionFlagsBits.UseVAD },
            { name: "Priority Speaker", flag: PermissionFlagsBits.PrioritySpeaker },
        ],
    },
];

const checkEmojis = {
    none: "<:CheckNone:900615195209138186>",
    off: "<:CheckOff:900615195154612276>",
    on: "<:CheckOn:900615194936475659>",
};


function permissionViewer(permissions: Permissions): APIEmbedField[] {

    const fields: APIEmbedField[] = [];

    for (const category of permissionCategories) {
        const list = category.permissions.map(permission => {
            const hasPermission = permissions.has(permission.flag);
            const emoji = hasPermission ? checkEmojis.on : checkEmojis.off;
            return `${emoji} ${permission.name}`;
        });

        fields.push({
            name: category.name,
            value: list.join("\n"),
            inline: true,
        });
    }

    return fields;
}
