// @jsxImportSource @riskybot/builders
import Command from "@riskybot/command";
import type { Permissions, UserFlags as UserFlag } from "discord-api-parser";
import { type ApplicationCommandInteraction, type AutocompleteInteraction } from "discord-api-parser";
import { env } from "#env.ts";
import config from "#config.ts";
import { reddit, topgg } from "@riskybot/apis";
import { listFormatter, resolveHexColor, trim, codeBlock, inlineCode, roleMention, time } from "@riskybot/tools";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { autoComplete as redditAutocomplete } from "./_reddit.ts";
import { ApplicationCommand, Embed, EmbedAuthor, EmbedField, EmbedImage, EmbedThumbnail, RoleOption, SubCommandOption, UserOption, StringOption, CommandOptions, ChannelOption } from "@lilybird/jsx";
import { ApplicationCommandType, ChannelType, UserFlags, PermissionFlags, type EmbedFieldStructure } from "lilybird";


export default class About extends Command {
    override name = "about";
    override description = "Replies with information about a user/role";

    // eslint-disable-next-line unicorn/consistent-function-scoping
    override command = (
        <ApplicationCommand name={this.name} description={this.description}>
            <SubCommandOption name="user" description="Replies with information about a user">
                <UserOption name="user" description="The user to get information about" required />
                <StringOption name="extra" description="Some more information that isn't as useful">
                    <CommandOptions name="Advanced" value="advanced" />
                    {env.TOPGG_TOKEN && <CommandOptions name="Top.gg" value="top.gg" />}
                </StringOption>
            </SubCommandOption>

            <SubCommandOption name="role" description="Replies with information about a role">
                <RoleOption name="role" description="The role to get information about" required />
                <StringOption name="extra" description="Some more information that isn't as useful">
                    <CommandOptions name="Advanced" value="advanced" />
                </StringOption>
            </SubCommandOption>

            <SubCommandOption name="channel" description="Replies with information about a channel">
                <ChannelOption name="channel" description="The channel to get information about" required />
                <StringOption name="extra" description="Some more information that isn't as useful">
                    <CommandOptions name="Advanced" value="advanced" />
                </StringOption>
            </SubCommandOption>

            <SubCommandOption name="subreddit" description="Get information about a subreddit">
                <StringOption name="subreddit" description="The name of the subreddit" required autocomplete />
            </SubCommandOption>
        </ApplicationCommand>
    );

    override aliases = ["About user"];
    override userCommand = {
        name: "About user",
        type: ApplicationCommandType.USER,
    };

    override async handleApplicationCommand(interaction: ApplicationCommandInteraction) {
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

                const userAvatar = user.avatarURL({ extension: "PNG", size: 512 });

                const embed = (
                    <Embed
                        color={config.colors.ok}
                        description={(user.publicFlags?.isEmpty() === false && userFlagsMapper(user.publicFlags).join("  ")) || undefined}
                    >
                        <EmbedAuthor name={"@" + user.username} url={"https://discord.com/users/" + user.id} icon_url={user.displayAvatarURL()} />
                        {userAvatar && <EmbedThumbnail url={userAvatar} />}
                        <EmbedField name="Made" value={`${time(user.createdAt)} (${time(user.createdAt, "R")})`} />
                        {user.banner && <EmbedImage url={user.bannerURL({ extension: "PNG", size: 512 })!} />}
                        {member && (
                            <>
                                {userAvatar && <EmbedThumbnail url={member.memberAvatarURL({ extension: "PNG", size: 512 }) ?? userAvatar} />}
                                <EmbedField name="Joined at" value={time(member.joinedAt)} inline={true} />
                                <EmbedField name="Server nickname" value={member.nickname ? inlineCode(member.nickname) : "*No nickname set*"} inline={true} />
                                {member.roles.length > 0 && <EmbedField name="Roles" value={member.roles.map(id => roleMention(id)).join(" ")} />}
                                {member.communicationDisabledUntil && <EmbedField name="Time out until" value={time(new Date(member.communicationDisabledUntil))} />}
                            </>
                        )}
                    </Embed>
                );

                if (extra === "advanced") {
                    const extraEmbed = (
                        <Embed title="Advanced info" color={config.colors.ok}>
                            <EmbedField name="ID" value={codeBlock(user.id)} />
                            <EmbedField name="Default Avatar URL" value={user.defaultAvatarURL} />
                            <EmbedField name="Current Avatar URL" value={user.displayAvatarURL()} />
                            {user.banner && <EmbedField name="Banner URL" value={user.bannerURL() || ""} />}
                            {member && (
                                <>
                                    {member.avatar && <EmbedField name="Member Avatar URL" value={member.memberAvatarURL() || ""} />}
                                    {member.permissions && permissionViewer(member.permissions).map(field => <EmbedField {...field} />)}
                                </>
                            )}
                        </Embed>
                    );

                    return interaction.reply({ embeds: [embed, extraEmbed] });
                }

                else if (extra === "top.gg") {
                    // const extraEmbed = new EmbedBuilder()
                    //     .setTitle("Top.gg advanced info")
                    //     .setColor(config.colors.ok);

                    if (!env.TOPGG_TOKEN) {
                        const extraEmbed = (
                            <Embed
                                title="Top.gg advanced info"
                                description="top.gg part disabled"
                                color={config.colors.warning}
                            />
                        );

                        return interaction.reply({ embeds: [embed, extraEmbed] });
                    }

                    if (user.bot) {
                        const data = await topgg.botInfo(user.id, env.TOPGG_TOKEN);
                        if (!data) {
                            const extraEmbed = (
                                <Embed
                                    title="Top.gg advanced info"
                                    color={config.colors.warning}
                                >
                                    <EmbedField name="Not found" value="Not in top.gg\n• *Note: not all bots and users are on [top.gg](https://top.gg)*" />
                                </Embed>
                            );

                            return interaction.reply({ embeds: [embed, extraEmbed] });
                        }

                        const extraEmbed = (
                            <Embed
                                title="Top.gg advanced info"
                                color={config.colors.ok}
                                url={"https://top.gg/bot/" + data.id}
                            >
                                <EmbedField name="Links" value={`• [invite](${data.invite})\n• [website](${data.website})`} />
                                <EmbedField name="Tags" value={listFormatter.format(data.tags) ?? "*No tags*"} />
                                <EmbedField name="Short Desc" value={data.shortdesc ?? "*No description*"} />
                                <EmbedField name="Information" value={[
                                    `• Prefix: ${inlineCode(data.prefix ?? "*None*")}`,
                                    `• Votes: ${inlineCode(data?.points.toLocaleString() ?? "*None*")} (Month: ${inlineCode(data?.monthlyPoints.toLocaleString() ?? "*None*")})`,
                                    `• Server count: ${inlineCode(data?.server_count?.toString() ?? "*None*") || "*Not specified*"}`
                                ].join("\n")} />

                                {data.bannerUrl && <EmbedImage url={data.bannerUrl} />}
                            </Embed>
                        );

                        if (data.bannerUrl) extraEmbed.setImage(data.bannerUrl);

                        return interaction.reply({ embeds: [embed, extraEmbed] });


                    } else {
                        const data = await topgg.userInfo(user.id, env.TOPGG_TOKEN);
                        if (!data) {
                            const extraEmbed = (
                                <Embed
                                    title="Top.gg advanced info"
                                    color={config.colors.warning}
                                >
                                    <EmbedField name="Not found" value="Not in top.gg\n• *Note: not all bots and users are on [top.gg](https://top.gg)*" />
                                </Embed>
                            );

                            return interaction.reply({ embeds: [embed, extraEmbed] });
                        }

                        const extraEmbed = (
                            <Embed
                                title="Top.gg advanced info"
                                color={config.colors.ok}
                                url={"https://top.gg/user/" + data.id}
                            >
                                <EmbedField name="Bio" value={data.bio ?? "*No bio*"} />
                                {data.banner && <EmbedImage url={data.banner} />}
                            </Embed>
                        );

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

                const embed = (
                    <Embed
                        title={"#" + channel.name}
                        color={config.colors.ok}
                    >
                        <EmbedField name="Type" value={channelEmoji[channel.type]} />
                        <EmbedField name="Created at" value={time(new Date(DiscordSnowflake.timestampFrom(channel.id)))} />
                    </Embed>
                );

                if (extra === "advanced") {
                    const extraEmbed = (
                        <Embed
                            title="Advanced info"
                            color={config.colors.ok}
                        >
                            <EmbedField name="ID" value={codeBlock(channel.id)} />
                        </Embed>
                    );
                    return interaction.reply({ embeds: [embed, extraEmbed] });
                }

                // finally return embed (if not extra)
                return interaction.reply({ embeds: [embed] });
            }

            case "role": {
                // Should always be a slash command
                if (!interaction.isChatInputCommand()) return;
                const role = interaction.options.getRole("role", true);


                const embed = (
                    <Embed
                        title={"@" + role.name}
                        color={config.colors.ok}
                    >
                        <EmbedField name="Created at" value={time(new Date(DiscordSnowflake.timestampFrom(role.id)))} />
                        <EmbedField name="Color" value={resolveHexColor(role.color)} />
                        {permissionViewer(role.permissions)}
                        <EmbedField name="Position" value={role.position.toString()} />
                    </Embed>
                );

                if (extra === "advanced") {
                    const extraEmbed = (
                        <Embed
                            title="Advanced info"
                            color={config.colors.ok}
                        >
                            <EmbedField name="ID" value={codeBlock(role.id)} />
                        </Embed>
                    );
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
                    const errorEmb = (
                        <Embed
                            color={config.colors.error}
                            title="Can't find your subreddit"
                            description={"No results found for" + inlineCode("r/" + subreddit)}
                        >
                            <EmbedAuthor name="Reddit" url="https://www.reddit.com/" icon_url="https://www.reddit.com/favicon.ico" />
                        </Embed>
                    );

                    return interaction.reply({ embeds: [errorEmb], ephemeral: true });
                }

                const thumbnail = info.community_icon.split("?")[0] || info.icon_img;

                const embed = (
                    <Embed
                        color={config.colors.ok}
                        title={info.display_name_prefixed}
                        url={info.url}
                    >
                        {thumbnail && <EmbedThumbnail url={thumbnail} />}
                        <EmbedField name="Title" value={trim(info.title, 1024)} />
                        <EmbedField name="Short description" value={trim(info.public_description || "*No description provided*", 1024)} />
                        <EmbedField name="Made" value={time(info.created_utc)} />
                        <EmbedField name="Stats" value={`🧑${info.subscribers.toLocaleString()}`} />
                        <EmbedAuthor name="Reddit" url="https://www.reddit.com/" icon_url="https://www.reddit.com/favicon.ico" />
                    </Embed>
                );

                return interaction.reply({ embeds: [embed] });

            }

        }

        return interaction.reply({ content: "This command is not yet implemented", ephemeral: true });

    }

    override async handleAutoComplete(interaction: AutocompleteInteraction) {
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
    [ChannelType.GUILD_TEXT]: "<:ChannelText:779036156175188001> Text channel",
    [ChannelType.GUILD_VOICE]: "<:ChannelVC:779036156607332394> Voice channel",
    [ChannelType.GROUP_DM]: "<:IconMembers:778932116024459275> Group DM channel",
    [ChannelType.GUILD_CATEGORY]: "<:ChannelCategory:816771723264393236> Category for channels",
    [ChannelType.GUILD_ANNOUNCEMENT]: "<:ChannelAnnouncements:779042577114202122> News Channel (announcements)",
    [ChannelType.ANNOUNCEMENT_THREAD]: "<:ChannelAnnouncementThread:897572964508266506> Thread in news channel",
    [ChannelType.PUBLIC_THREAD]: "<:ChannelThread:842224626486607872> Thread in channel",
    [ChannelType.PRIVATE_THREAD]: "<:ChannelThreadPrivate:842224739275898921> Thread in channel (private)",
    [ChannelType.GUILD_STAGE_VOICE]: "<:StagePublic:829073837538410556> Stage channel",
    [ChannelType.GUILD_FORUM]: "Forum Channel",
    [ChannelType.GUILD_DIRECTORY]: "Directory channel",
    [ChannelType.GUILD_MEDIA]: "Media channel",
};

const userFlagsEmoji = {
    [UserFlags.HYPESQUAD]: "<:HypeSquadEvents:899099369742155827>",
    [UserFlags.BUG_HUNTER_LEVEL_2]: "<:BugHunterLevel2:899099369767313429>",
    [UserFlags.BUG_HUNTER_LEVEL_1]: "<:BugHunterLevel1:899099369989615616>",
    [UserFlags.PREMIUM_EARLY_SUPPORTER]: "<:EarlySupporter:899099370056724500>",
    [UserFlags.CERTIFIED_MODERATOR]: "<:DiscordCertifiedModerator:899099370077716480>",
    [UserFlags.HYPESQUAD_ONLINE_HOUSE_3]: "<:HouseBalance:899099370069319680>",
    [UserFlags.HYPESQUAD_ONLINE_HOUSE_2]: "<:HouseBrilliance:899099370090295367>",
    [UserFlags.HYPESQUAD_ONLINE_HOUSE_1]: "<:HouseBravery:899099370186760213>",
    [UserFlags.STAFF]: "<:DiscordEmployee:899099370161586217>",
    [UserFlags.VERIFIED_DEVELOPER]: "<:EarlyVerifiedBotDeveloper:899099370190946354>",
    [UserFlags.VERIFIED_BOT]: "<:VerifiedBot:899099370228695130>",
    [UserFlags.TEAM_PSEUDO_USER]: "<:TeamUser:899099370232889364>",
    [UserFlags.PARTNER]: "<:PartneredServerOwner:899099370396450827>",
    [UserFlags.BOT_HTTP_INTERACTIONS]: "HTTP Interaction BOT",
    [2 ** 44]: "Quarantined",
    [UserFlags.ACTIVE_DEVELOPER]: "Active dev",
};


function userFlagsMapper(flags: UserFlag): string[] {
    if (!flags) return [];

    return Object.entries(userFlagsEmoji)
        .filter(([flag,]) => flags.has(BigInt(flag)))
        .map(([, emoji]) => emoji);
}

const permissionCategories = [
    {
        name: "General Permissions",
        permissions: [
            { name: "Administrator", flag: PermissionFlags.ADMINISTRATOR },
            { name: "View Audit Log", flag: PermissionFlags.VIEW_AUDIT_LOG },
            { name: "View Server Insights", flag: PermissionFlags.VIEW_GUILD_INSIGHTS },
            { name: "Manage Server", flag: PermissionFlags.MANAGE_GUILD },
            { name: "Manage Roles", flag: PermissionFlags.MANAGE_ROLES },
            { name: "Manage Channels", flag: PermissionFlags.MANAGE_CHANNELS },
            { name: "Kick Members", flag: PermissionFlags.KICK_MEMBERS },
            { name: "Ban Members", flag: PermissionFlags.BAN_MEMBERS },
            { name: "Create Instant Invite", flag: PermissionFlags.CREATE_INSTANT_INVITE },
            { name: "Change Nickname", flag: PermissionFlags.CHANGE_NICKNAME },
            { name: "Manage Nicknames", flag: PermissionFlags.MANAGE_NICKNAMES },
            { name: "Manage Emojis/Stickers", flag: PermissionFlags.MANAGE_GUILD_EXPRESSIONS },
            { name: "Manage Webhooks", flag: PermissionFlags.MANAGE_WEBHOOKS },
            { name: "Manage Channels", flag: PermissionFlags.MANAGE_CHANNELS },
            { name: "Manage Events", flag: PermissionFlags.MANAGE_EVENTS },
            { name: "Moderate Members", flag: PermissionFlags.MODERATE_MEMBERS },
            { name: "View Channel", flag: PermissionFlags.VIEW_CHANNEL },
        ],
    },
    {
        name: "Text Permissions",
        permissions: [
            { name: "Send Messages", flag: PermissionFlags.SEND_MESSAGES },
            { name: "Create Public Threads", flag: PermissionFlags.CREATE_PUBLIC_THREADS },
            { name: "Create Private Threads", flag: PermissionFlags.CREATE_PRIVATE_THREADS },
            { name: "Send Messages in Threads", flag: PermissionFlags.SEND_MESSAGES_IN_THREADS },
            { name: "Send TTS Messages", flag: PermissionFlags.SEND_TTS_MESSAGES },
            { name: "Manage Messages", flag: PermissionFlags.MANAGE_MESSAGES },
            { name: "Manage Threads", flag: PermissionFlags.MANAGE_THREADS },
            { name: "Embed Links", flag: PermissionFlags.EMBED_LINKS },
            { name: "Attach Files", flag: PermissionFlags.ATTACH_FILES },
            { name: "Read Message History", flag: PermissionFlags.READ_MESSAGE_HISTORY },
            { name: "Mention Everyone", flag: PermissionFlags.MENTION_EVERYONE },
            { name: "Use External Emojis", flag: PermissionFlags.USE_EXTERNAL_EMOJIS },
            { name: "Use External Stickers", flag: PermissionFlags.USE_EXTERNAL_STICKERS },
            { name: "Add Reactions", flag: PermissionFlags.ADD_REACTIONS },
            { name: "Use Slash Commands", flag: PermissionFlags.USE_APPLICATION_COMMANDS },
        ],
    },
    {
        name: "Voice Permissions",
        permissions: [
            { name: "Connect", flag: PermissionFlags.CONNECT },
            { name: "Speak", flag: PermissionFlags.SPEAK },
            { name: "Mute Members", flag: PermissionFlags.MUTE_MEMBERS },
            { name: "Deafen Members", flag: PermissionFlags.DEAFEN_MEMBERS },
            { name: "Move Members", flag: PermissionFlags.MOVE_MEMBERS },
            { name: "Use Voice Activity", flag: PermissionFlags.USE_VAD },
            { name: "Priority Speaker", flag: PermissionFlags.PRIORITY_SPEAKER },
        ],
    },
];

const checkEmojis = {
    none: "<:CheckNone:900615195209138186>",
    off: "<:CheckOff:900615195154612276>",
    on: "<:CheckOn:900615194936475659>",
};


function permissionViewer(permissions: Permissions): EmbedFieldStructure[] {

    const fields: EmbedFieldStructure[] = [];

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
