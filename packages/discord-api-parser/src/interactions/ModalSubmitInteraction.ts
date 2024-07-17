/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { ComponentType, type InteractionType, type MessageStructure, type Locale, type ModalSubmitInteractionStructure, type MessageComponentStructure } from "lilybird";
import BaseInteraction from "./BaseInteraction.ts";
import { type InteractionResponseMixin, applyInteractionResponseMixins, createInteractionMixinList } from "./Response.ts";


export default class ModalSubmitInteraction extends BaseInteraction {
    declare type: InteractionType.MODAL_SUBMIT;

    /** The custom id for the modal */
    customId: string;
    /** The fields that the invoking user has provided for the modal */
    fields: ModalSubmitFields;
    /** The selected language of the invoking user */
    locale: Locale;
    /** For components, the message they were attached to */
    message?: MessageStructure;

    constructor(interaction: ModalSubmitInteractionStructure & { message: MessageStructure }) {
        super(interaction);

        this.customId = interaction.data.custom_id;
        this.fields = new ModalSubmitFields(interaction.data.components ?? []);
        this.locale = interaction.locale;
        this.message = interaction.message;
    }

    /** Whether this is from a message component. */
    isFromMessage(): this is ModalMessageModalSubmitInteraction {
        return Boolean(this.message);
    }

}

const allowedResponses = createInteractionMixinList([
    "reply",
    "editReply",
    "deleteReply",
    "deferReply",
    "fetchReply",
    "followUp"
]);

applyInteractionResponseMixins(ModalSubmitInteraction, [...allowedResponses, "update", "deferUpdate"]);

export default interface ModalSubmitInteraction extends InteractionResponseMixin<typeof allowedResponses> { }

export interface ModalMessageModalSubmitInteraction extends ModalSubmitInteraction { message: MessageStructure }
export interface ModalMessageModalSubmitInteraction extends InteractionResponseMixin<["update", "deferUpdate"]> { }


export type fields = TextInputOption;


export class BaseField {
    type: ComponentType;
    customId: string;
    value: string | number | boolean;

    constructor(type: ComponentType, customId: string, value: string | number | boolean) {
        this.type = type;
        this.customId = customId;
        this.value = value;
    }
}
export class TextInputOption extends BaseField {
    declare type: ComponentType.TextInput;
    declare value: string;

    constructor(customId: string, value: string) {
        super(ComponentType.TextInput, customId, value);
    }
}

function formatField(component: MessageComponentStructure): fields {
    switch (component.type) {
        case ComponentType.TextInput: {
            return new TextInputOption(component.custom_id, component.value!);
        }

        default: {
            throw new Error(`Unknown component type: ${component.type}`);
        }
    }
}

export class ModalSubmitFields {
    values: Record<string, fields> = {};

    constructor(components: MessageComponentStructure[]) {

        for (const row of components) {
            if (row.type !== ComponentType.ActionRow) {
                throw new Error(`Expected action row, got ${row.type}`);
            }
            for (const component of row.components) {
                if (component.type === ComponentType.TextInput) {
                    this.values[component.custom_id] = formatField(component);
                } else {
                    throw new Error(`Unknown component type: ${component.type}`);
                }
            }
        }
    }

    getField(customId: string, required: true): fields;
    getField(customId: string, required?: boolean): fields | undefined;
    getField(customId: string, required?: boolean): fields | undefined {
        const field = this.values[customId];
        if (!field && required) {
            throw new Error(`Field "${customId}" is required`);
        }
        return field;
    }

    getTextInputValue(customId: string, required: true): string;
    getTextInputValue(customId: string, required?: boolean): string | undefined;
    getTextInputValue(customId: string, required?: boolean): string | undefined {
        return this.getField(customId, required)?.value as string;
    }

}
