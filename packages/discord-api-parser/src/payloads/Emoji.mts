import { APIEmoji, CDNRoutes, EmojiFormat, ImageFormat } from "discord-api-types/v10";
import { DISCORD_CDN_BASE_URL } from "../constants.mjs";
import User from "./User.mjs";


export class Emoji {
    /** Emoji id */
    id: string | null;
    /** Emoji name (can be null only in reaction emoji objects) */
    name: string | null;
    /** Roles this emoji is whitelisted to */
    roles?: string[];
    /** Roles this emoji is whitelisted to */
    user?: User;
    /** Whether this emoji must be wrapped in colons */
    requireColons?: boolean;
    /** Whether this emoji is managed */
    managed?: boolean;
    /** Whether this emoji is animated */
    animated?: boolean;
    /** Whether this emoji can be used, may be false due to loss of Server Boosts */
    available?: boolean;


    constructor(emoji: APIEmoji) {
        this.id = emoji.id;
        this.name = emoji.name;
        this.roles = emoji.roles;
        this.user = emoji.user ? new User(emoji.user) : undefined;
        this.requireColons = emoji.require_colons;
        this.managed = emoji.managed;
        this.animated = emoji.animated;
        this.available = emoji.available;
    }

    /** The emoji url for the emoji  */
    avatarURL(config: {extension: EmojiFormat, size: number } = {extension: ImageFormat.PNG, size: 64}): string | null {
        if (!this.id) return null;
        return DISCORD_CDN_BASE_URL + CDNRoutes.emoji(this.id, config.extension) + `?size=${config.size}`;
    }

}

export default Emoji;