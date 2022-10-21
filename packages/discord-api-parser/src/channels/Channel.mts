import { APIChannel, ChannelFlags as APIChannelFlags, ChannelType } from "discord-api-types/v10";
import BitField from "../basic/BitField.mjs";
import BaseChannel from "./BaseChannel.mjs";
import DMChannel from "./DM.mjs";
import GroupDMChannel from "./GroupDM.mjs";
import GuildCategoryChannel from "./GuildCategory.mjs";
import GuildDirectoryChannel from "./GuildDirectory.mjs";
import GuildForumChannel from "./GuildForum.mjs";
import GuildNewsChannel from "./GuildNews.mjs";
import GuildNewsThread from "./GuildNewsThread.mjs";
import GuildPrivateThread from "./GuildPrivateThread.mjs";
import GuildPublicThread from "./GuildPublicThread.mjs";
import GuildStageVoice from "./GuildStageVoice.mjs";
import GuildTextChannel from "./GuildText.mjs";
import GuildVoiceChannel from "./GuildVoice.mjs";

export type Channel = DMChannel | GroupDMChannel | GuildCategoryChannel | GuildDirectoryChannel | GuildForumChannel | GuildNewsChannel | GuildNewsThread | GuildPrivateThread | GuildPublicThread | GuildStageVoice | GuildTextChannel | GuildVoiceChannel;



// new Channel().

export class ChannelFlags extends BitField {
    constructor(flags: number) {
        super(BigInt(flags));
    }

    /** Whether the user has a flag */
    has(flag: bigint | APIChannelFlags ): boolean {
        return super.has(BigInt(flag));
    }

    /** Weather the user even has any flags */
    isEmpty(): boolean {
        return this.bitfield === 0n;
    }

}

export function parseRawChannel(data: APIChannel): Channel {
    let ChannelClass;

    switch (data.type) {
        case ChannelType.DM:
            ChannelClass = DMChannel;
            break;
        case ChannelType.GroupDM:
            ChannelClass = GroupDMChannel;
            break;
        case ChannelType.GuildCategory:
            ChannelClass = GuildCategoryChannel;
            break;
        // @ts-expect-error aaa
        case ChannelType.GuildDirectory:
            ChannelClass = GuildDirectoryChannel;
            break;
        case ChannelType.GuildForum:
            ChannelClass = GuildForumChannel;
            break;
        case ChannelType.GuildAnnouncement:
            ChannelClass = GuildNewsChannel;
            break;
        case ChannelType.AnnouncementThread:
            ChannelClass = GuildNewsThread;
            break;
        case ChannelType.PrivateThread:
            ChannelClass = GuildPrivateThread;
            break;
        case ChannelType.PublicThread:
            ChannelClass = GuildPublicThread;
            break;
        case ChannelType.GuildStageVoice:
            ChannelClass = GuildStageVoice;
            break;
        case ChannelType.GuildText:
            ChannelClass = GuildTextChannel;
            break;
        case ChannelType.GuildVoice:
            ChannelClass = GuildVoiceChannel;
            break;
        default:
            // @ts-expect-error aaa
            throw new Error(`Unknown channel type: ${data.type}`);
    }

    ChannelClass ||= BaseChannel;

    return new ChannelClass(data) as Channel;
}