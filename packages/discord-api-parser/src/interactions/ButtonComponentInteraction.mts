import type { APIMessageComponentButtonInteraction, ComponentType } from "discord-api-types/v10";
import MessageComponentInteraction from "./MessageComponentInteraction.mjs";

export default class ButtonInteraction extends MessageComponentInteraction {
    declare componentType: ComponentType.Button;

    constructor(interaction: APIMessageComponentButtonInteraction) {
        super(interaction);
    }

}
