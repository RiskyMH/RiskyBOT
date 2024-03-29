import type { APIMessageComponentSelectMenuInteraction, ComponentType } from "discord-api-types/v10";
import MessageComponentInteraction from "./MessageComponentInteraction.mjs";

export default class SelectMenuInteraction extends MessageComponentInteraction {
    declare componentType: ComponentType.StringSelect | ComponentType.RoleSelect | ComponentType.UserSelect | ComponentType.ChannelSelect | ComponentType.MentionableSelect;
    /** The values of the select menu */
    values: string[];

    constructor(interaction: APIMessageComponentSelectMenuInteraction) {
        super(interaction);
        this.values = interaction.data.values;
    }

}
