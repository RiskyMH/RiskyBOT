import type { ChannelType, APIGuildVoiceChannel } from "discord-api-types/v10.js";
import BaseChannel from "./BaseChannel.mjs";


export class GuildVoiceChannel extends BaseChannel {
    declare type: ChannelType.GuildText;   

    constructor(channel: APIGuildVoiceChannel) {
        super(channel);
        // TODO: Finish implementing
    }

}

export default GuildVoiceChannel;