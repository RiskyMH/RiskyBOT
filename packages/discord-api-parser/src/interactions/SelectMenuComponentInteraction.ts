import type { ComponentType, MessageComponentInteractionStructure } from "lilybird";
import MessageComponentInteraction from "./MessageComponentInteraction.ts";

export default class SelectMenuInteraction extends MessageComponentInteraction {
    declare componentType: ComponentType.StringSelect | ComponentType.RoleSelect | ComponentType.UserSelect | ComponentType.ChannelSelect | ComponentType.MentionableSelect;
    /** The values of the select menu */
    values: string[];

    constructor(interaction: MessageComponentInteractionStructure) {
        super(interaction);
        this.values = interaction.data.values as unknown as string[];
    }

}
