import type { ChannelType, APITextChannel } from "discord-api-types/v10.js";
import BaseChannel from "./BaseChannel.mjs";


export class GuildTextChannel extends BaseChannel {
    declare type: ChannelType.GuildText;   

    constructor(channel: APITextChannel) {
        super(channel);
        // TODO: Finish implementing
    }

}

export default GuildTextChannel;