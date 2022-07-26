import type { APIMessageComponentSelectMenuInteraction, ComponentType } from "discord-api-types/v10";
import MessageComponentInteraction from "./MessageComponentInteraction.mjs";

export default class SelectMenuInteraction extends MessageComponentInteraction {
    declare componentType: ComponentType.SelectMenu;
    /** The values of the select menu */
    values: string[];

    constructor(interaction: APIMessageComponentSelectMenuInteraction) {
        super(interaction);
        this.values = interaction.data.values;
    }

    isSelectMenu(): true {
        return true;
    }


}
