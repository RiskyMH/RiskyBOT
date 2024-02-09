import { type ChannelFlags as ChannelFlagsEnum, ChannelType } from "lilybird";
import BitField from "../basic/BitField.ts";


// TODO: Add the other channel options

export class ChannelFlags extends BitField {
    constructor(flags: number) {
        super(BigInt(flags));
    }

    /** Whether the user has a flag */
    override has(flag: bigint | ChannelFlagsEnum): boolean {
        return super.has(BigInt(flag));
    }

    /** Weather the user even has any flags */
    isEmpty(): boolean {
        return this.bitfield === 0n;
    }

}

export const GuildTextBasedChannelTypes = [
    ChannelType.GUILD_TEXT,
    ChannelType.GUILD_ANNOUNCEMENT,
    ChannelType.ANNOUNCEMENT_THREAD,
    ChannelType.PUBLIC_THREAD,
    ChannelType.PRIVATE_THREAD,
    ChannelType.GUILD_VOICE,
    ChannelType.GUILD_STAGE_VOICE,
];

export const TextBasedChannelTypes = [
    ...GuildTextBasedChannelTypes,
    ChannelType.DM
];

export const ThreadChannelTypes = [
    ChannelType.ANNOUNCEMENT_THREAD,
    ChannelType.PUBLIC_THREAD,
    ChannelType.PRIVATE_THREAD
];

export const VoiceBasedChannelTypes = [
    ChannelType.GUILD_VOICE,
    ChannelType.GUILD_STAGE_VOICE
];

export const DMChannelTypes = [
    ChannelType.DM,
    ChannelType.GUILD_FORUM
];
