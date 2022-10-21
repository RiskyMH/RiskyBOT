import type { APIChannel, APIInteractionDataResolvedChannel, APIPartialChannel, APIThreadMetadata, ChannelType } from "discord-api-types/v10";
import Permissions from "../basic/Permissions.mjs";

/** A channel but basic */
export class PartialChannel {
    /** The id of the channel */
    readonly id: string;
    /** The name of the channel */
    readonly name?: string | null;
    /** The type of the channel */
    readonly type: ChannelType;

    constructor(channel: APIPartialChannel | APIChannel) {
        this.id = channel.id;
        this.name = channel.name;
        this.type = channel.type;
    }
}

/** A channel but from the resolved part of a Interaction */
export class InteractionDataResolvedChannel extends PartialChannel {
    /** Thread-specific channel fields  */
    threadMetadata?: APIThreadMetadata | null;
    /** The permissions of the invoking user for the channel */
    permissions: Permissions;
    /** The id of the parent channel */
    parentId?: string | null;

    constructor(channel: APIInteractionDataResolvedChannel) {
        super(channel);

        this.threadMetadata = channel.thread_metadata;
        this.permissions = new Permissions(channel.permissions);
        this.parentId = channel.parent_id;

    }
}

export default PartialChannel;