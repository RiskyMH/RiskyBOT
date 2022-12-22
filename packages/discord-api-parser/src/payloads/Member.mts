import { APIGuildMember, APIInteractionDataResolvedGuildMember, APIInteractionGuildMember, CDNRoutes, ImageFormat, UserAvatarFormat } from "discord-api-types/v10";
import Permissions from "../basic/Permissions.mjs";
import { DISCORD_CDN_BASE_URL } from "../constants.mjs";
import User from "./User.mjs";

/** A guild member */
export class GuildMember {
    /** This users guild nickname */
    nickname?: string | null;
    /** The member's guild avatar hash */
    avatar?: string | null;
    /** Array of role object ids */
    roles: string[];
    /** When the user joined the guild */
    joinedAt: Date;
    /** When the user started boosting the guild */
    premiumSince?: string | null;
    /** Whether the user has not yet passed the guild's Membership Screening requirements */
    pending?: boolean;
    /** Timestamp of when the time out will be removed; until then, they cannot interact with the guild */
    communicationDisabledUntil?: string | null;

    /** Whether the user is deafened in voice channels */
    deaf: boolean;
    /** Whether the user is muted in voice channels */
    mute: boolean;

    /** The guild id that this member is in */
    guildId: string;
    /** The members's user id */
    userId: string;
    /** The member's user object */
    user?: User;

    constructor(member: APIGuildMember, guildId: string, userId?: string) {
        this.guildId = guildId;
        this.userId = userId || member.user!.id;
        this.user = member.user ? new User(member.user) : undefined;

        this.avatar = member.avatar;
        this.nickname = member.nick;
        this.roles = member.roles;
        this.joinedAt = new Date(member.joined_at);
        this.premiumSince = member.premium_since;
        this.pending = member.pending;
        this.communicationDisabledUntil = member.communication_disabled_until;
        this.deaf = member.deaf;
        this.mute = member.mute;

    }

    /** The member's custom avatar in the guild (not to be confused with {@link User.avatarURL}) */
    memberAvatarURL(config: { extension: UserAvatarFormat, size: number, animatedExtension?: UserAvatarFormat } = { extension: ImageFormat.GIF, size: 512, animatedExtension: ImageFormat.GIF }): string | null {
        if (!this.avatar) return null;
        if (!this.avatar.startsWith("a_") && config.extension === ImageFormat.GIF) config.extension = ImageFormat.PNG;
        return DISCORD_CDN_BASE_URL + CDNRoutes.guildMemberAvatar(this.guildId, this.userId, this.avatar, config.extension) + `?size=${config.size}`;
    }

}

/** A guild member but from an interaction */
export class InteractionGuildMember extends GuildMember {
    declare user: User;
    /** The permissions the member has */
    permissions: Permissions;


    constructor(member: APIInteractionGuildMember, guildId: string, userId?: string) {
        super(member, guildId, userId);

        this.permissions = new Permissions(member.permissions);
    }


}

/** A guild member but from the resolved part of an interaction */
export class InteractionDataResolvedGuildMember extends InteractionGuildMember {

    constructor(member: APIInteractionDataResolvedGuildMember, guildId: string, userId: string) {
        // @ts-expect-error: The types for this member is removing properties
        super(member, guildId, userId);
    }

    /** @deprecated This will never be filled with data */
    declare deaf: never;

    /** @deprecated This will never be filled with data */
    declare muted: never;

    /** @deprecated This will never be filled with data */
    declare user: never;
}


export default GuildMember;
