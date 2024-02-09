import type { ComponentType, MessageComponentInteractionStructure } from "lilybird";
import MessageComponentInteraction from "./MessageComponentInteraction.ts";

export default class ButtonInteraction extends MessageComponentInteraction {
    declare componentType: ComponentType.Button;

    constructor(interaction: MessageComponentInteractionStructure) {
        super(interaction);
    }

}
