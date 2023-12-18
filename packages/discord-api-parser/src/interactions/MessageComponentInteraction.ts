/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import type { ComponentType, InteractionType, Locale, MessageComponentInteractionStructure, MessageStructure } from "lilybird";
import BaseInteraction from "./BaseInteraction.ts";
import { type InteractionResponseMixin, applyInteractionResponseMixins, createInteractionMixinList } from "./Response.ts";


export default class MessageComponentInteraction extends BaseInteraction {
    declare type: InteractionType.MESSAGE_COMPONENT;

    /** The custom id of the component */
    customId: string;
    /** For components, the message they were attached to */
    message: MessageStructure;
    /** The type of the component */
    componentType: ComponentType;
    /** The selected language of the invoking user */
    locale: Locale;


    constructor(interaction: MessageComponentInteractionStructure) {
        super(interaction);

        this.customId = interaction.data.custom_id;
        this.message = interaction.message;
        this.componentType = interaction.data.component_type;
        this.locale = interaction.locale;
    }

}


const allowedResponses = createInteractionMixinList([
    "reply",
    "editReply",
    "deleteReply",
    "deferReply",
    "fetchReply",
    "followUp",
    "showModal",
    "deferUpdate",
    "update"
]);

applyInteractionResponseMixins(MessageComponentInteraction, allowedResponses);

export default interface MessageComponentInteraction extends InteractionResponseMixin<typeof allowedResponses> { }

