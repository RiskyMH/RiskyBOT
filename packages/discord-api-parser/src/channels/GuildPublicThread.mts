import type { ChannelType, APIThreadChannel } from "discord-api-types/v10.js";
import GuildThread from "./GuildThread.mjs";


export class GuildPublicThread extends GuildThread {
    declare type: ChannelType.GuildPublicThread;   

    constructor(channel: APIThreadChannel) {
        super(channel);
        // TODO: Finish implementing
    }

}

export default GuildPublicThread;