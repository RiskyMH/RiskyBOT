import type { ChannelType, APIThreadChannel } from "discord-api-types/v10.js";
import GuildThread from "./GuildThread.mjs";


export class GuildNewsThread extends GuildThread {
    declare type: ChannelType.GuildNewsThread;   

    constructor(channel: APIThreadChannel) {
        super(channel);
        // TODO: Finish implementing
    }

}

export default GuildNewsThread;