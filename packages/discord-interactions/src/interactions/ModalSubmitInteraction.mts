import { APIMessage, APIModalSubmitInteraction, ComponentType, InteractionResponseType, InteractionType, LocaleString, MessageFlags, ModalSubmitActionRowComponent, ModalSubmitComponent, Routes, Snowflake } from "discord-api-types/v10";
import { fetch, Headers } from "undici";
import { DISCORD_API_BASE_URL } from "../constants.mjs";
import BaseInteraction, { InteractionResponseData } from "./Interaction.mjs";


export default class ModalSubmitInteraction extends BaseInteraction {
    declare type: InteractionType.ModalSubmit;

    /** The custom id for the modal */
    customId: string;
    /** The fields that the invoking user has provided for the modal */
    fields: ModalSubmitFields;
    /** The selected language of the invoking user */
    locale: LocaleString;

    constructor(interaction: APIModalSubmitInteraction) {
        super(interaction);

        this.customId = interaction.data.custom_id;
        this.fields = new ModalSubmitFields(interaction.data.components ?? []);
        this.locale = interaction.locale;
    }

    isModalSubmit(): true {
        return true;
    }

    async reply(data: InteractionResponseData, fetchResponse: true): Promise<APIMessage>;
    async reply(data: InteractionResponseData, fetchResponse?: boolean): Promise<void>;
    async reply(data: InteractionResponseData, fetchResponse?: boolean): Promise<void | APIMessage> {

        const url = DISCORD_API_BASE_URL+ Routes.interactionCallback(this.id, this.token);

        const body = {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {...data, flags: data.ephemeral ? MessageFlags.Ephemeral : null},
        };
        
        const res = await fetch(url, { body: JSON.stringify(body), headers: jsonHeaders, method: "POST" });

        if (!res.ok) {
            throw new Error(await res.text());
        }
             
        if (fetchResponse) return this.fetchReply();
        return;
    }

    async editReply(data: InteractionResponseData, messageId: Snowflake | "@original" = "@original"): Promise<APIMessage>  {

        const url = DISCORD_API_BASE_URL + Routes.webhookMessage(this.applicationId, this.token, messageId);

        const body = {
            // flags: data?.ephemeral ? MessageFlags.Ephemeral : null,
            ...data,
        };

        const res = await fetch(url, { body: JSON.stringify(body), headers: jsonHeaders, method: "PATCH" });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        return await res.json() as APIMessage;
    }

    async deleteReply(messageId: Snowflake | "@original" = "@original"): Promise<void>  {

        const url = DISCORD_API_BASE_URL + Routes.webhookMessage(this.applicationId, this.token, messageId);
        
        const res = await fetch(url, { method: "DELETE" });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        return;
    }

    async followUp(data: InteractionResponseData): Promise<APIMessage>  {

        const url = DISCORD_API_BASE_URL + Routes.interactionCallback(this.id, this.token);

        const body = {
            flags: data.ephemeral ? MessageFlags.Ephemeral : null,
            ...data,
        };

        const res = await fetch(url, { body: JSON.stringify(body), headers: jsonHeaders, method: "POST" });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        return await res.json() as APIMessage;
    }

    async fetchReply(messageId: Snowflake | "@original" = "@original"): Promise<APIMessage> {

        const url = DISCORD_API_BASE_URL + Routes.webhookMessage(this.applicationId, this.token, messageId);

        const res = await fetch(url, {method: "GET" });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        return await res.json() as APIMessage;
    }

    async deferReply(data?: { ephemeral?: boolean }): Promise<void>  {

        const url = DISCORD_API_BASE_URL + Routes.interactionCallback(this.id, this.token);

        const body = {
            type: InteractionResponseType.DeferredChannelMessageWithSource,
            flags: data?.ephemeral ? MessageFlags.Ephemeral : null,
        };

        const res = await fetch(url, { body: JSON.stringify(body), headers: jsonHeaders, method: "POST" });
        
        if (!res.ok) {
            throw new Error(await res.text());
        }
        
        return;
    }

}

const jsonHeaders = new Headers({ "content-type": "application/json" });

type fields = TextInputOption

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

function formatField (component: ModalSubmitComponent): fields {
    switch (component.type) {
        case ComponentType.TextInput:
            return new TextInputOption(component.custom_id, component.value);
        default:
            throw new Error(`Unknown component type: ${component.type}`);
    }
} 

class ModalSubmitFields {
    values: { [key: string]: fields } = {};

    constructor(components: ModalSubmitActionRowComponent[]) {
        // this.components = components;

        for (const row of components) {
            for (const component of row.components) {
                this.values[component.custom_id] = formatField(component);
            }
        }
    }

    getField(customId: string, required: true): fields;
    getField(customId: string, required?: boolean): fields | undefined;
    getField(customId: string, required?: boolean): fields | undefined {
        const field = this.values[customId];
        if (!field && required) {
            throw new Error(`Field ${customId} is required`);
        }
        return field;
    }
    
    getTextInputValue(customId: string, required: true): string 
    getTextInputValue(customId: string, required?: boolean): string | undefined 
    getTextInputValue(customId: string, required?: boolean): string | undefined {
        return this.getField(customId, required)?.value as string;
    }

}