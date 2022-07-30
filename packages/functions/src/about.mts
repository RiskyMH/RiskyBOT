import { time, hyperlink,inlineCode, userMention, bold, codeBlock, EmbedBuilder, roleMention, SlashCommandSubcommandBuilder, SlashCommandBuilder, SlashCommandUserOption, SlashCommandStringOption, SlashCommandRoleOption, SlashCommandChannelOption, ContextMenuCommandBuilder } from "@discordjs/builders";
import { APIEmbedField, ApplicationCommandType, ChannelType, ImageFormat, PermissionFlagsBits, UserFlags as UserFlagsEnum } from "discord-api-types/v10";
import { redditAutoComplete, reddit } from "./index.mjs";
import { listFormatter } from "@riskybot/tools";
import { topgg } from "@riskybot/apis";
import type { Config, EnvEnabled } from "@riskybot/tools";
import type { User, InteractionGuildMember, InteractionDataResolvedGuildMember, Role, InteractionDataResolvedChannel, Permissions, UserFlags } from "@riskybot/discord-interactions";


//TODO: Make sure everything works...
sad

export default async function about(config: Config, option: {user?: User, member?:  InteractionGuildMember | InteractionDataResolvedGuildMember, role?: Role, channel?: InteractionDataResolvedChannel, stringInput?: string, name: string}, extra: string, topggKey?: string )/**: Promise <InteractionReplyOptions> */  {

    const aboutEmbed = new EmbedBuilder().setColor(config.getColors().ok);
    const aboutEmbedExtra = new EmbedBuilder().setColor(config.getColors().ok);

    // USER
    if (option.user) {

        aboutEmbed
            .setAuthor({ name: option.user.tag, iconURL: option.user.displayAvatarURL(), url: "https://discord.com/users/"+ option.user.id })
            .addFields([{name: "Made", value: time(option.user.createdAt) +" (" +time(option.user.createdAt, "R") +")"}])
            // .addFields([{ name: "Username", value: codeBlock(`${option.user.username}#${option.user.discriminator}`) },])
            .setThumbnail(option.user.avatarURL({extension: ImageFormat.PNG, size: 512}));

        if (option.user.banner) aboutEmbed.setImage(option.user?.bannerURL({extension: ImageFormat.PNG, size: 512}));

        if (!option.user.publicFlags?.isEmpty()) aboutEmbed.setDescription(userFlagsMapper(option.user.publicFlags).join("  "));
            
        if (extra === "advanced") {
            aboutEmbedExtra
                .setTitle("About - " +inlineCode("User:") + bold(inlineCode(option.user.username)) + inlineCode("(advanced)"))
                .addFields([{name:"ID", value: codeBlock(option.user.id)}])
                .addFields([{name: "Default Avatar URL", value: option.user.defaultAvatarURL}])
                .addFields([{ name: "Current Avatar URL", value: hyperlink( "https://cdn.discordapp.com/avatars/...", option.user.displayAvatarURL())}]);
            if (option.user.banner) aboutEmbedExtra.addFields([{name: "Banner URL", value: hyperlink("https://cdn.discordapp.com/banners/...", option.user?.bannerURL()?? "")}]);

        } else if (extra === "top.gg") {
            if (topggKey) {
                
                    if (option.user.bot) {
                        const data = await topgg.botInfo(option.user.id, topggKey);
                        if (!data) {
                            aboutEmbedExtra
                                .setTitle("About - " + inlineCode("user/bot:") + bold(inlineCode(option.user.username)) + inlineCode("(Top.gg)"))
                                .addFields([{ name: "Not found", value: "Not in top.gg\n• *Note: not all bots and users are on [top.gg](https://top.gg)*" }])
                                .setColor(config.getColors().warning);
                        } else{

                            aboutEmbedExtra
                                .setTitle("About - " +inlineCode("Bot:") + bold(inlineCode(option.user.username)) + inlineCode("(Top.gg)")) 
                                .setURL("https://top.gg/bot/" + data.id)   
                                .addFields([{name: "Links", value:  `• [invite](${data.invite})\n• [website](${data.website})`}])
                                .addFields([{name: "Tags", value: listFormatter.format(data.tags) ?? "*No tags*"}])
                                .addFields([{name: "Short Desc",value:  data.shortdesc ?? "*No description*"}])
                                .addFields([{name: "Information",value: `• Prefix: ${inlineCode(data.prefix ?? "*None*")}\n• Votes: ${inlineCode(data?.points.toLocaleString() ?? "*None*")} (Month: ${inlineCode(data?.monthlyPoints.toLocaleString() ?? "*None*")})\n• Server count: ${inlineCode(data?.server_count?.toString() ?? "*None*") ||"*Not specified*"}`}]);
                            if (data.bannerUrl) aboutEmbedExtra.setImage(data.bannerUrl);
                        }
                    } else {
                        const data = await topgg.userInfo(option.user.id, topggKey);
                        if (!data ) {
                            aboutEmbedExtra
                                .setTitle("About - " + inlineCode("user/bot:") + bold(inlineCode(option.user.username)) + inlineCode("(Top.gg)"))
                                .addFields([{ name: "Not found", value: "Not in top.gg\n• *Note: not all bots and users are on [top.gg](https://top.gg)*" }])
                                .setColor(config.getColors().warning);
                        } else{

                            aboutEmbedExtra
                                .setTitle("About - " + inlineCode("User:") + bold(inlineCode(option.user.username)) + inlineCode("(Top.gg)"))
                                .addFields([{name: "Bio", value: data.bio ?? "*No bio*"}]);
                            if (data.banner) aboutEmbedExtra.setImage(data.banner);

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
                    .setColor(config.getColors().warning);
            }
        }
    }
    // MEMBER
    if (option.member) {
        
        aboutEmbed
            // .setTitle("About - " +inlineCode("User:") +bold(inlineCode(option.member?.nickname ?? option.user!.username)))
            .setThumbnail(option.member.memberAvatarURL({extension: ImageFormat.PNG, size: 512}) || option.user?.avatarURL({extension: ImageFormat.PNG, size: 512}) || null)
            .addFields([
                {
                    name: "Joined at",
                    value: time(option.member.joinedAt),
                    inline: true,
                },
                {
                    name: "Server nickname", 
                    value: option.member.nickname ? inlineCode(option.member.nickname): "*No nickname set*",
                    inline: true,
                },
            ]);

        if (option.member?.roles?.length) aboutEmbed.addFields([{name: "Roles", value: option.member.roles.map((e) => (roleMention(String(e)))).join(" ")}]);
        if (option.member?.communicationDisabledUntil) aboutEmbed.addFields([{name: "Time out until", value: time(new Date(option.member.communicationDisabledUntil))}]);

        if (extra === "advanced") {
            aboutEmbedExtra
                .setTitle("About - " +inlineCode("User:") +bold(inlineCode(option.member?.nickname ?? option.user?.username ?? ":(")) +inlineCode("(advanced)"));
            if (option.member.avatar) aboutEmbedExtra.addFields([{name: "Guild Avatar URL", value: hyperlink("https://cdn.discordapp.com/guilds/.../users/.../avatars/...", option.member.memberAvatarURL()?? "")}]);

            if (option.member.permissions) aboutEmbedExtra.addFields(await permissionViewer(option.member.permissions));
        }
        // ROLE
    } else if (option.role) {
        aboutEmbed.setTitle("About - " + inlineCode("Role:") + bold(inlineCode(option.role.name)));
        aboutEmbed.addFields(await permissionViewer(option.role.permissions))
                  .addFields([{name: "Position", value: codeBlock(option.role.position.toString())}]);

        if (option.role.tags?.bot_id) aboutEmbed.addFields([{name: "Bot role", value: userMention(option.role.tags?.bot_id)}]);

        if (extra === "advanced") {
            aboutEmbedExtra
                .setTitle("About - " +inlineCode("Role:") +bold(inlineCode(option.role.name)) +inlineCode("(advanced)"))
                .addFields([{name: "ID", value: codeBlock(option.role.id)}])
                .addFields([{name: "Notes", value:`Pinned in the user listing: \`${option.role.hoist}\``}]);
        }

    } else if (option.channel) {
        aboutEmbed.setTitle(
            "About - " + inlineCode("Channel:") + bold(inlineCode(option.channel.name ?? "Channel"))
        );
        aboutEmbed.addFields([{name: "Type", value: channelTypeMapper(option.channel.type)}]); 

        if (extra === "advanced") {
            aboutEmbedExtra
                .setTitle("About - " +inlineCode("Channel:") +bold(inlineCode(option.channel.name ?? "Channel Name...")) +inlineCode("(advanced)"))
                .addFields([{name: "ID", value: codeBlock(option.channel.id)}]);
        }
    }
    if (option.name === "subreddit") {
        return await reddit(config, "subreddit", option.stringInput?.toString()?? "", option.user?.id);
    }

    if (!extra) return { embeds: [aboutEmbed] };
    else return { embeds: [aboutEmbed, aboutEmbedExtra] };
}


export async function autoComplete(type: string, input: string) {

    switch (type) {
        case "subreddit": {
            return await redditAutoComplete( "sub-reddit", input);
        }
    }

    return [];
}


const flagsEmoji = {
    Hypesquad: "<:HypeSquadEvents:899099369742155827>",
    BugHunterLevel2: "<:BugHunterLevel2:899099369767313429>",
    BugHunterLevel1: "<:BugHunterLevel1:899099369989615616>",
    PremiumEarlySupporter: "<:EarlySupporter:899099370056724500>",
    HypeSquadOnlineHouse3: "<:HouseBalance:899099370069319680>",
    CertifiedModerator: "<:DiscordCertifiedModerator:899099370077716480>",
    HypeSquadOnlineHouse2: "<:HouseBrilliance:899099370090295367>",
    DISCORD_EMPLOYEE: "<:DiscordEmployee:899099370161586217>",
    HypeSquadOnlineHouse1: "<:HouseBravery:899099370186760213>",
    VerifiedDeveloper: "<:EarlyVerifiedBotDeveloper:899099370190946354>",
    VerifiedBot: "<:VerifiedBot:899099370228695130>",
    TEAM_USER: "<:TeamUser:899099370232889364>",
    PARTNERED_SERVER_OWNER: "<:PartneredServerOwner:899099370396450827>",
    BotHTTPInteractions: "BotHTTPInteractions",
    Staff: "Staff"
};

function channelTypeMapper(type: ChannelType): string {
    if (type === ChannelType.DM)                    return "<:IconMembers:778932116024459275> DM channel";
    if (type === ChannelType.GuildText)             return "<:ChannelText:779036156175188001> Text channel";
    if (type === ChannelType.GuildVoice)            return "<:ChannelVC:779036156607332394> Voice channel";
    if (type === ChannelType.GroupDM)               return "<:IconMembers:778932116024459275> Group DM channel";
    if (type === ChannelType.GuildCategory)         return "<:ChannelCategory:816771723264393236> Category for channels";
    if (type === ChannelType.GuildNews)             return "<:ChannelAnnouncements:779042577114202122> News Channel (announcements)";
    if (type === ChannelType.GuildNewsThread)       return "<:ChannelAnnouncementThread:897572964508266506> Thread in news channel";
    if (type === ChannelType.GuildPublicThread)     return "<:ChannelThread:842224626486607872> Thread in channel";
    if (type === ChannelType.GuildPrivateThread)    return "<:ChannelThreadPrivate:842224739275898921> Thread in channel (private)";
    if (type === ChannelType.GuildStageVoice)       return "<:StagePublic:829073837538410556> Stage channel";
    if (type === ChannelType.GuildForum)            return "Forum Channel";
    if (type === ChannelType.GuildDirectory)        return "Directory channel";
    return "";
}


function userFlagsMapper(flags: UserFlags | undefined): string[] {
    const list = [];
    if (!flags) return [""];

    if (flags.has(UserFlagsEnum.Hypesquad)) list.push(flagsEmoji.Hypesquad);
    if (flags.has(UserFlagsEnum.BugHunterLevel2)) list.push(flagsEmoji.BugHunterLevel2);
    if (flags.has(UserFlagsEnum.BugHunterLevel1)) list.push(flagsEmoji.BugHunterLevel1);
    if (flags.has(UserFlagsEnum.PremiumEarlySupporter)) list.push(flagsEmoji.PremiumEarlySupporter);
    if (flags.has(UserFlagsEnum.CertifiedModerator)) list.push(flagsEmoji.CertifiedModerator);
    if (flags.has(UserFlagsEnum.Staff)) list.push(flagsEmoji.DISCORD_EMPLOYEE);
    if (flags.has(UserFlagsEnum.HypeSquadOnlineHouse1)) list.push(flagsEmoji.HypeSquadOnlineHouse1);
    if (flags.has(UserFlagsEnum.HypeSquadOnlineHouse2)) list.push(flagsEmoji.HypeSquadOnlineHouse2);
    if (flags.has(UserFlagsEnum.HypeSquadOnlineHouse3)) list.push(flagsEmoji.HypeSquadOnlineHouse3);
    if (flags.has(UserFlagsEnum.VerifiedDeveloper)) list.push(flagsEmoji.VerifiedDeveloper);
    if (flags.has(UserFlagsEnum.VerifiedBot)) list.push(flagsEmoji.VerifiedBot);
    if (flags.has(UserFlagsEnum.TeamPseudoUser)) list.push(flagsEmoji.TEAM_USER);
    if (flags.has(UserFlagsEnum.Partner)) list.push(flagsEmoji.PARTNERED_SERVER_OWNER);
    if (flags.has(UserFlagsEnum.BotHTTPInteractions)) list.push(flagsEmoji.BotHTTPInteractions);
    if (flags.has(UserFlagsEnum.Quarantined)) list.push("<:Quarantined:899099370109879552>");
    if (flags.has(1 << 23)) list.push("(slash commands)");

    return list;
}
function permissionViewer(permissions: Permissions): APIEmbedField[] {
    const emojis = {
        none: "<:CheckNone:900615195209138186>",
        off: "<:CheckOff:900615195154612276>",
        on: "<:CheckOn:900615194936475659>",
    };

    const listGeneral = [];

    // Has administrator permissions
    if (permissions.has(PermissionFlagsBits.Administrator)) {
        listGeneral.push(emojis.on + " Administrator");
    } else  {
        listGeneral.push(emojis.off + " Administrator");
    } 

    // Has view audit log permissions (or administrator permissions)
    if (permissions.has(PermissionFlagsBits.ViewAuditLog)) {
        listGeneral.push(emojis.on + " View Audit Log");
    } else {
         listGeneral.push(emojis.off + " View Audit Log");
    }

    // Has view guild insights permissions (or administrator permissions)
    if (permissions.has(PermissionFlagsBits.ViewGuildInsights)) {
        listGeneral.push(emojis.on + " View Server Insights");
    } else {
        listGeneral.push(emojis.off + " View Server Insights");
    }
    if (permissions.has(PermissionFlagsBits.ManageGuild)) {
        listGeneral.push(emojis.on + " Manage Server");
    } else listGeneral.push(emojis.off + " Manage Server");
    if (permissions.has(PermissionFlagsBits.ManageRoles)) {
        listGeneral.push(emojis.on + " Manage Roles");
    } else listGeneral.push(emojis.off + " Manage Roles");
    if (permissions.has(PermissionFlagsBits.ManageChannels)) {
        listGeneral.push(emojis.on + " Manage Channels");
    } else listGeneral.push(emojis.off + " Manage Channels");
    if (permissions.has(PermissionFlagsBits.KickMembers)) {
        listGeneral.push(emojis.on + " Kick Members");
    } else listGeneral.push(emojis.off + " Kick Members");
    if (permissions.has(PermissionFlagsBits.BanMembers)) {
        listGeneral.push(emojis.on + " Ban Members");
    } else listGeneral.push(emojis.off + " Ban Members");
    if (permissions.has(PermissionFlagsBits.CreateInstantInvite)) {
        listGeneral.push(emojis.on + " Create Instant Invite");
    } else listGeneral.push(emojis.off + " Create Instant Invite");
    if (permissions.has(PermissionFlagsBits.ChangeNickname)) {
        listGeneral.push(emojis.on + " Change Nickname");
    } else listGeneral.push(emojis.off + " Change Nickname");
    if (permissions.has(PermissionFlagsBits.ManageNicknames)) {
        listGeneral.push(emojis.on + " Manage Nicknames");
    } else listGeneral.push(emojis.off + " Manage Nicknames");
    if (permissions.has(PermissionFlagsBits.ManageEmojisAndStickers)) {
        listGeneral.push(emojis.on + " Manage Emojis/Stickers");
    } else listGeneral.push(emojis.off + " Manage Emojis/Stickers");
    if (permissions.has(PermissionFlagsBits.ManageWebhooks)) {
        listGeneral.push(emojis.on + " Manage Webhooks");
    } else listGeneral.push(emojis.off + " Manage Webhooks");
    if (permissions.has(PermissionFlagsBits.ManageChannels))
        listGeneral.push(emojis.on + " View Channels");
    else listGeneral.push(emojis.off + " View Channels");
    if (permissions.has(PermissionFlagsBits.ManageEvents))
        listGeneral.push(emojis.on + " Manage Events");
    else listGeneral.push(emojis.off + " Manage Events");
    if (permissions.has(PermissionFlagsBits.ModerateMembers))
        listGeneral.push(emojis.on + " Moderate Members");
    else listGeneral.push(emojis.off + " Moderate Members");

    const listText = [];
    if (permissions.has(PermissionFlagsBits.SendMessages)) {
        listText.push(emojis.on + " Send Messages");
    } else listText.push(emojis.off + " Send Messages");
    if (permissions.has(PermissionFlagsBits.CreatePublicThreads))
        listText.push(emojis.on + " Create Public Threads");
    else listText.push(emojis.off + " Create Public Threads");
    if (permissions.has(PermissionFlagsBits.CreatePrivateThreads))
        listText.push(emojis.on + " Create Private Threads");
    else listText.push(emojis.off + " Create Private Threads");
    if (permissions.has(PermissionFlagsBits.SendMessagesInThreads))
        listText.push(emojis.on + " Send Messages in Threads");
    else listText.push(emojis.off + " Send Messages in Threads");
    if (permissions.has(PermissionFlagsBits.SendTTSMessages))
        listText.push(emojis.on + " Send TTS Messages");
    else listText.push(emojis.off + " Send TTS Messages");
    if (permissions.has(PermissionFlagsBits.ManageMessages))
        listText.push(emojis.on + " Manage Messages");
    else listText.push(emojis.off + " Manage Messages");
    if (permissions.has(PermissionFlagsBits.ManageThreads))
        listText.push(emojis.on + " Manage Threads");
    else listText.push(emojis.off + " Manage Threads");
    if (permissions.has(PermissionFlagsBits.EmbedLinks))
        listText.push(emojis.on + " Embed Links");
    else listText.push(emojis.off + " Embed Links");
    if (permissions.has(PermissionFlagsBits.AttachFiles))
        listText.push(emojis.on + " Embed Files");
    else listText.push(emojis.off + " Embed Files");
    if (permissions.has(PermissionFlagsBits.ReadMessageHistory))
        listText.push(emojis.on + " Read Message History");
    else listText.push(emojis.off + " Read Message History");
    if (permissions.has(PermissionFlagsBits.MentionEveryone))
        listText.push(emojis.on + " Mention Everyone");
    else listText.push(emojis.off + " Mention Everyone");
    if (permissions.has(PermissionFlagsBits.UseExternalEmojis))
        listText.push(emojis.on + " Use External Emojis");
    else listText.push(emojis.off + " Use External Emojis");
    if (permissions.has(PermissionFlagsBits.UseExternalStickers))
        listText.push(emojis.on + " Use External Stickers");
    else listText.push(emojis.off + " Use External Stickers");
    if (permissions.has(PermissionFlagsBits.AddReactions))
        listText.push(emojis.on + " Add Reactions");
    else listText.push(emojis.off + " Add Reactions");
    if (permissions.has(PermissionFlagsBits.UseApplicationCommands))
        listText.push(emojis.on + " Use Slash Commands");
    else listText.push(emojis.off + " Use Slash Commands");

    const listVoice = [];
    if (permissions.has(PermissionFlagsBits.Connect))
        listVoice.push(emojis.on + " Connect");
    else listVoice.push(emojis.off + " Connect");
    if (permissions.has(PermissionFlagsBits.Speak))
        listVoice.push(emojis.on + " Speak");
    else listVoice.push(emojis.off + " Speak");
    if (permissions.has(PermissionFlagsBits.MuteMembers))
        listVoice.push(emojis.on + " Mute Members");
    else listVoice.push(emojis.off + " Mute Members");
    if (permissions.has(PermissionFlagsBits.DeafenMembers))
        listVoice.push(emojis.on + " Deafen Members");
    else listVoice.push(emojis.off + " Deafen Members");
    if (permissions.has(PermissionFlagsBits.MoveMembers))
        listVoice.push(emojis.on + " Move Members");
    else listVoice.push(emojis.off + " Move Members");
    if (permissions.has(PermissionFlagsBits.UseVAD))
        listVoice.push(emojis.on + " Use Voice Activity");
    else listVoice.push(emojis.off + " Use Voice Activity");
    if (permissions.has(PermissionFlagsBits.PrioritySpeaker))
        listVoice.push(emojis.on + " Priory Speaker");
    else listVoice.push(emojis.off + " Priory Speaker");

    return [
        { name: "General Permissions", value: listGeneral.join("\n"), inline: true },
        { name: "Test Permissions", value: listText.join("\n"), inline: true },
        { name: "Voice Permissions", value: listVoice.join("\n"), inline: true },
    ];
}


export function applicationCommands(config?: Config, envEnabledList?: EnvEnabled) {

    const aboutUserCommand = new ContextMenuCommandBuilder()
        .setName("About user")
        .setType(ApplicationCommandType.User);

    const userAboutOptions = [{name: "Advanced", value: "advanced"}];

    if (envEnabledList?.HasTopggToken && config?.apiEnabled?.topgg) userAboutOptions.push({name: "Top.gg", value: "top.gg"});

    const  aboutSlashCommand = new SlashCommandBuilder()
        .setName("about")
        .setDescription("Replies with information about a user/role")
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
                            {name: "Advanced", value: "advanced"}
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
                            {name: "Advanced", value: "advanced"}
                        )
                )  
        );
    if (config?.apiEnabled?.reddit) {
        aboutSlashCommand.addSubcommand( 
            new SlashCommandSubcommandBuilder()
                .setName("subreddit")
                .setDescription("Get information about a subreddit")
                .addStringOption(
                    new SlashCommandStringOption()
                        .setName("sub-reddit")
                        .setDescription("The name of the subreddit")
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        );  
    }  
    return [aboutUserCommand, aboutSlashCommand];
}