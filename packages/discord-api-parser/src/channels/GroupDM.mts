import type { APIGroupDMChannel, ChannelType } from "discord-api-types/v10";
import User from "../payloads/User.mjs";
import BaseChannel from "./BaseChannel.mjs";


export class GroupDMChannel extends BaseChannel {
    declare type: ChannelType.DM;
    declare name?: string | null ;
    lastMessageID?: string | null;
    recipients?: User[];

    constructor(channel: APIGroupDMChannel) {
        super(channel);

        this.lastMessageID = channel.last_message_id;
        this.recipients = channel.recipients?.map((user) => new User(user));
        
        // TODO: Finish implementing
    }
}

export default GroupDMChannel;