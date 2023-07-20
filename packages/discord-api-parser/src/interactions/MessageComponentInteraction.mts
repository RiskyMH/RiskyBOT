/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import type { APIMessage, APIMessageComponentInteraction, ComponentType, InteractionType, LocaleString } from "discord-api-types/v10";
import BaseInteraction from "./BaseInteraction.mjs";
import { InteractionResponseMixin, applyInteractionResponseMixins, createInteractionMixinList } from "./Response.mjs";


export default class MessageComponentInteraction extends BaseInteraction {
    declare type: InteractionType.MessageComponent;
    
    /** The custom id of the component */
    customId: string;
    /** For components, the message they were attached to */
    message: APIMessage;
    /** The type of the component */
    componentType: ComponentType;
    /** The selected language of the invoking user */
    locale: LocaleString;


    constructor(interaction: APIMessageComponentInteraction) {
        super(interaction);

        this.customId = interaction.data.custom_id;
        this.message = interaction.message;
        this.componentType = interaction.data.component_type;
        this.locale = interaction.locale;
    }

    // isMessageComponent(): true {
    //     return true;
    // }

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

export default interface MessageComponentInteraction extends InteractionResponseMixin<typeof allowedResponses> {}

