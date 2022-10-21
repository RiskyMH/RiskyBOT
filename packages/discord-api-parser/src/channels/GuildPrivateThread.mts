import type { ChannelType, APIThreadChannel } from "discord-api-types/v10.js";
import GuildThread from "./GuildThread.mjs";


export class GuildPrivateThread extends GuildThread {
    declare type: ChannelType.GuildPrivateThread;   

    constructor(channel: APIThreadChannel) {
        super(channel);
        // TODO: Finish implementing
    }

}

export default GuildPrivateThread;