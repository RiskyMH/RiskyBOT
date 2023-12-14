import { ChannelFlags as APIChannelFlags, ChannelType } from "discord-api-types/v10";
import BitField from "../basic/BitField.ts";


// TODO: Add the other channel options

export class ChannelFlags extends BitField {
    constructor(flags: number) {
        super(BigInt(flags));
    }

    /** Whether the user has a flag */
    override has(flag: bigint | APIChannelFlags): boolean {
        return super.has(BigInt(flag));
    }

    /** Weather the user even has any flags */
    isEmpty(): boolean {
        return this.bitfield === 0n;
    }

}

export const GuildTextBasedChannelTypes = [
    ChannelType.GuildText,
    ChannelType.GuildAnnouncement,
    ChannelType.AnnouncementThread,
    ChannelType.PublicThread,
    ChannelType.PrivateThread,
    ChannelType.GuildVoice,
    ChannelType.GuildStageVoice,
];

export const TextBasedChannelTypes = [
    ...GuildTextBasedChannelTypes,
    ChannelType.DM
];

export const ThreadChannelTypes = [
    ChannelType.AnnouncementThread,
    ChannelType.PublicThread,
    ChannelType.PrivateThread
];

export const VoiceBasedChannelTypes = [
    ChannelType.GuildVoice,
    ChannelType.GuildStageVoice
];

export const DMChannelTypes = [
    ChannelType.DM,
    ChannelType.GroupDM
];
