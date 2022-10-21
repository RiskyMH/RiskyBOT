import type { ChannelType, APIGuildStageVoiceChannel } from "discord-api-types/v10.js";
import BaseChannel from "./BaseChannel.mjs";


export class GuildStageVoice extends BaseChannel {
    declare type: ChannelType.GuildStageVoice;   

    constructor(channel: APIGuildStageVoiceChannel) {
        super(channel);
        // TODO: Finish implementing
    }

}

export default GuildStageVoice;