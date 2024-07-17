import { ChannelType, type ThreadMetadataStructure } from "lilybird";
import Permissions from "../basic/Permissions.ts";

interface PartialChannelStructure {
    id: string;
    name: string | null;
    type: ChannelType;
}

/** A channel but basic */
export class PartialChannel {
    /** The id of the channel */
    readonly id: string;
    /** The name of the channel */
    readonly name?: string | null;
    /** The type of the channel */
    readonly type: ChannelType;
    
    constructor(channel: PartialChannelStructure) {
        this.id = channel.id;
        this.name = channel.name;
        this.type = channel.type;
    }
}

interface GuildChannelStructure extends PartialChannelStructure {
    thread_metadata?: ThreadMetadataStructure | null;
    parent_id?: string | null;
    permissions?: bigint | string;
}

/** A channel but from the resolved part of a Interaction */
export class InteractionDataResolvedChannel extends PartialChannel {
    /** Thread-specific channel fields  */
    threadMetadata?: ThreadMetadataStructure | null;
    /** The permissions of the invoking user for the channel */
    permissions: Permissions;
    /** The id of the parent channel */
    parentId?: string | null;

    constructor(channel: GuildChannelStructure) {
        super(channel);

        this.permissions = new Permissions(channel.permissions!);

        if (channel.type === ChannelType.PUBLIC_THREAD || channel.type === ChannelType.PRIVATE_THREAD || channel.type === ChannelType.ANNOUNCEMENT_THREAD) {
            this.threadMetadata = channel.thread_metadata;
            this.parentId = channel.parent_id;
        }
    }
}

export default PartialChannel;