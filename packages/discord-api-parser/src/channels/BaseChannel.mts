import type { APIChannel } from "discord-api-types/v10";
import PartialChannel from "./PartialChannel.mjs";
import { ChannelFlags } from "./Channel.mjs";

/** A guild channel */
export class BaseChannel extends PartialChannel {

    flags: ChannelFlags;
    
    // TODO: Implement the full set of channels

    constructor(channel: APIChannel) {
        super(channel);

        this.flags = new ChannelFlags(channel?.flags ?? 0);
    }

}

export default BaseChannel;
