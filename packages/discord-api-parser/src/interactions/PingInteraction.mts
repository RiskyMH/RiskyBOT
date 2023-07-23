import type { APIPingInteraction, InteractionType } from "discord-api-types/v10";
import BaseInteraction from "./BaseInteraction.mjs";

/**
 * **Note:** This type of interaction is automatically handled when using `@riskybot/command` so you don't need to do anything with it.
 */
export default class PingInteraction extends BaseInteraction {
    declare type: InteractionType.Ping;

    constructor(interaction: APIPingInteraction) {
        super(interaction);
    }

    // handle(response) {
    //     response.send({ type: InteractionResponseType.Pong });

    // }

}
