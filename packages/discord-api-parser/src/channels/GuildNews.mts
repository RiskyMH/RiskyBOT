import type { ChannelType, APINewsChannel } from "discord-api-types/v10.js";
import BaseChannel from "./BaseChannel.mjs";


export class GuildNewsChannel extends BaseChannel {
    declare type: ChannelType.GuildNews;   

    constructor(channel: APINewsChannel) {
        super(channel);
        // TODO: Finish implementing
    }

}

export default GuildNewsChannel;