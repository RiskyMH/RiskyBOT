import type { ChannelType, APIGuildCategoryChannel } from "discord-api-types/v10.js";
import BaseChannel from "./BaseChannel.mjs";


export class GuildCategoryChannel extends BaseChannel {
    declare type: ChannelType.GuildCategory;   

    constructor(channel: APIGuildCategoryChannel) {
        super(channel);
        // TODO: Finish implementing
    }


}

export default GuildCategoryChannel;