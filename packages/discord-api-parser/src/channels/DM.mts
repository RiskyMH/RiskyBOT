import type { APIDMChannel, ChannelType } from "discord-api-types/v10";
import User from "../payloads/User.mjs";
import BaseChannel from "./BaseChannel.mjs";


export class DMChannel extends BaseChannel {
    declare type: ChannelType.DM;
    lastMessageID?: string | null;
    recipients?: User[];

    constructor(channel: APIDMChannel) {
        super(channel);

        this.lastMessageID = channel.last_message_id;
        this.recipients = channel.recipients?.map(user => new User(user));
    }

}

export default DMChannel;