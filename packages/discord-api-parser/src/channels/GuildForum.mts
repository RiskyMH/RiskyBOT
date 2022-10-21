import type { ChannelType, APIGuildForumChannel } from "discord-api-types/v10.js";
import BaseChannel from "./BaseChannel.mjs";


export class GuildForumChannel extends BaseChannel {
    declare type: ChannelType.GuildForum;   

    constructor(channel: APIGuildForumChannel) {
        super(channel);
        // TODO: Finish implementing
    }

}

export default GuildForumChannel;