import type { ChannelType, APIThreadChannel } from "discord-api-types/v10.js";
import BaseChannel from "./BaseChannel.mjs";


export class GuildThread extends BaseChannel {
    declare type: ChannelType.GuildPublicThread | ChannelType.GuildPrivateThread | ChannelType.GuildNewsThread;   

    constructor(channel: APIThreadChannel) {
        super(channel);
        // TODO: Finish implementing
    }

}

export default GuildThread;