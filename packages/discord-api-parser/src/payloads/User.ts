import { DiscordSnowflake } from "@sapphire/snowflake";
import type { UserStructure, Locale, PremiumType, UserFlags as UserFlagsEnum } from "lilybird";
import BitField from "../basic/BitField.ts";
import { DISCORD_CDN_BASE_URL } from "../constants.ts";
import { DiscordCDNRoutes } from "@riskybot/tools";


/** A user */
export class User {
    /** The user's id */
    id: string;
    /** The user's username, not unique across the platform */
    username: string;
    /** The user's 4-digit discord-tag */
    discriminator: string;
    /** The user's avatar hash */
    avatar: string | null;
    /** The user's banner color encoded as an integer representation of hexadecimal color code */
    accentColor?: number | null;
    /** The user's banner hash */
    banner?: string | null;
    /** Whether the user belongs to an OAuth2 application */
    bot?: boolean;
    /** The user's email (not available on all user objects) */
    email?: string | null;
    /** The flags on a user's account */
    flags?: UserFlags;
    /** The user's chosen language option */
    locale?: Locale;
    /** Whether the user has two factor enabled on their account (not available on all user objects)  */
    mfaEnabled?: boolean;
    /** The type of Nitro subscription on a user's account */
    premiumType?: PremiumType;
    /** The public flags on a user's account */
    publicFlags?: UserFlags;
    /** Whether the user is an Official Discord System user (part of the urgent message system) */
    system?: boolean;
    /** Whether the email on this account has been verified (not available on all user objects) */
    verified?: boolean;


    constructor(user: UserStructure) {
        this.id = user.id;
        this.username = user.username;
        this.discriminator = user.discriminator;
        this.avatar = user.avatar;
        this.accentColor = user.accent_color;
        this.banner = user.banner;
        this.bot = user.bot;
        this.email = user.email;
        this.flags = new UserFlags(user.flags || 0);
        this.locale = user.locale;
        this.mfaEnabled = user.mfa_enabled;
        this.premiumType = user.premium_type;
        this.publicFlags = new UserFlags(user.public_flags || 0);
        this.system = user.system;
        this.verified = user.verified;
    }

    /** The date that the user was created */
    get createdAt(): Date {
        return new Date(DiscordSnowflake.timestampFrom(this.id));
    }

    /** The avatar url for the user */
    avatarURL(config: { extension: string, size: number, animatedGif?: boolean } = { extension: "png", size: 512, animatedGif: true }): string | null {
        if (!this.avatar) return null;
        if (this.avatar.startsWith("a_") && config.animatedGif) config.extension = "gif";
        return DISCORD_CDN_BASE_URL + DiscordCDNRoutes.userAvatar(this.id, this.avatar, config.extension) + `?size=${config.size}`;
    }

    /** The url for the user's banner */
    bannerURL(config: { extension: string, size: number, animatedGif?: boolean } = { extension: "png", size: 512, animatedGif: true }): string | null {
        if (!this.banner) return null;
        if (this.banner.startsWith("a_") && config.animatedGif) config.extension = "gif";
        return DISCORD_CDN_BASE_URL + DiscordCDNRoutes.userBanner(this.id, this.banner, config.extension) + `?size=${config.size}`;
    }

    /** The url for the user's default avatar */
    get defaultAvatarURL(): string {
        const modulo = Number(this.id) % 6 as 1 | 2 | 3 | 4 | 5;
        return DISCORD_CDN_BASE_URL + DiscordCDNRoutes.defaultUserAvatar(modulo);
    }

    /** The url for the user's current display avatar */
    displayAvatarURL(config: { extension: string, size: number } = { extension: "png", size: 512 }): string {
        return this.avatarURL(config) || this.defaultAvatarURL;
    }

}


export class UserFlags extends BitField {
    constructor(flags: number) {
        super(BigInt(flags));
    }

    /** Whether the user has a flag */
    override has(flag: bigint | UserFlagsEnum): boolean {
        return super.has(BigInt(flag));
    }

    /** Weather the user even has any flags */
    isEmpty(): boolean {
        return this.bitfield === 0n;
    }

}

export default User;