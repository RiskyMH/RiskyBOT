import type { APIChannel, ChannelType } from "discord-api-types/v10.js";
import BaseChannel from "./BaseChannel.mjs";

// Seems like it doesn't have any extra properties
export class GuildDirectoryChannel extends BaseChannel {
    declare type: ChannelType.GuildDirectory;   

    constructor(channel: APIChannel) {
        super(channel);
    }
}

export default GuildDirectoryChannel;