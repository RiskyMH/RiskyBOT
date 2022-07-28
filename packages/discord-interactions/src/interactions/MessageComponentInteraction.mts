import { APIMessage, APIMessageComponentInteraction, ComponentType, InteractionResponseType, InteractionType, LocaleString, MessageFlags, Routes, Snowflake } from "discord-api-types/v10";
import { fetch, Headers } from "undici";
import { DISCORD_API_BASE_URL } from "../constants.mjs";
import BaseInteraction, { InteractionModalResponseData, InteractionResponseData } from "./Interaction.mjs";

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

    isMessageComponent(): true {
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

    async update(data: InteractionResponseData, fetchResponse: true): Promise<APIMessage>;
    async update(data: InteractionResponseData, fetchResponse?: boolean): Promise<void>;
    async update(data: InteractionResponseData, fetchResponse?: boolean): Promise<void | APIMessage> {

        const url = DISCORD_API_BASE_URL+ Routes.interactionCallback(this.id, this.token);

        const body = {
            type: InteractionResponseType.UpdateMessage,
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

    async deferUpdate(data?: { ephemeral?: boolean }): Promise<void>  {

        const url = DISCORD_API_BASE_URL + Routes.interactionCallback(this.id, this.token);

        const body = {
            type: InteractionResponseType.DeferredMessageUpdate,
            flags: data?.ephemeral ? MessageFlags.Ephemeral : null,
        };

        const res = await fetch(url, { body: JSON.stringify(body), headers: jsonHeaders, method: "POST" });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        return;
    }

    async showModal(data: InteractionModalResponseData) {
            
        const url = DISCORD_API_BASE_URL + Routes.interactionCallback(this.id, this.token);

        const body = {
            type: InteractionResponseType.Modal,
            data,
        };

        const res = await fetch(url, { body: JSON.stringify(body), headers: jsonHeaders, method: "POST" });

        if (!res.ok) {
            throw new Error(await res.text());
        }
        
        return;
    }



}

const jsonHeaders = new Headers({ "content-type": "application/json" });
