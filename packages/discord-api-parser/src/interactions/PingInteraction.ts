import BaseInteraction from "./BaseInteraction.ts";
import type { InteractionType, PingInteractionStructure } from "lilybird";

/**
 * **Note:** This type of interaction is automatically handled when using `@riskybot/command` so you don't need to do anything with it.
 */
export default class PingInteraction extends BaseInteraction {
    declare type: InteractionType.PING;

    constructor(interaction: PingInteractionStructure) {
        super(interaction);
    }
}
