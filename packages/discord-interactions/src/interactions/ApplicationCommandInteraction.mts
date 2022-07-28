import {
  APIInteractionDataResolvedGuildMember,
  ApplicationCommandType,
  Snowflake,
  APIUser,
  APIAttachment,
  APIInteractionDataResolvedChannel,
  APIMessage,
  APIRole,
  APIApplicationCommandInteraction,
  InteractionType,
  InteractionResponseType,
  MessageFlags,
  LocaleString,
} from "discord-api-types/v10";
import type {ApplicationCommandOptionType} from "discord-api-types/v10";
import BaseInteraction, { InteractionModalResponseData, InteractionResponseData } from "./Interaction.mjs";
import { fetch, Headers } from "undici";
import { Routes } from "discord-api-types/v10";
import { DISCORD_API_BASE_URL } from "../constants.mjs";


export default class ApplicationCommandInteraction extends BaseInteraction {
    declare type: InteractionType.ApplicationCommand;
    /** The command's Id */
    commandId: Snowflake;
    /** The command's name */
    commandName: string;
    /** The type of command */
    commandType: ApplicationCommandType;
    /** If the command was a guild specific, that guild's id */
    commandGuildId?: Snowflake;
    /** The selected language of the invoking user */
    locale: LocaleString;

    constructor(interaction: APIApplicationCommandInteraction) {
        super(interaction);
        
        this.commandId = interaction.data.id;
        this.commandName = interaction.data.name;
        this.commandType = interaction.data.type;
        this.commandGuildId = interaction.data.guild_id;
        this.locale = interaction.locale;

    }

    isApplicationCommand(): true {
        return true;
    }

    /** Reply to the interaction (within 3sec) */
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

    /** Edit a response to the interaction */
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

    /** Delete a reply from the interaction*/
    async deleteReply(messageId: Snowflake | "@original" = "@original"): Promise<void>  {

        const url = DISCORD_API_BASE_URL + Routes.webhookMessage(this.applicationId, this.token, messageId);
        
        const res = await fetch(url, { method: "DELETE" });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        return;
    }

    /** Create a new  */
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

    async showModal (data: InteractionModalResponseData) {
            
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

const jsonHeaders = new Headers({"content-type": "application/json"});

export type CommandInteractionOptions = {
  name: string;
  type: ApplicationCommandOptionType | ApplicationCommandType;
  value?: string | number | boolean;
  focused?: boolean;
  autocomplete?: boolean;
  options?: CommandInteractionOptions[];
  user?: APIUser;
  member?: APIInteractionDataResolvedGuildMember;
  channel?: APIInteractionDataResolvedChannel;
  role?: APIRole;
  attachment?: APIAttachment;
  message?: APIMessage;

}

