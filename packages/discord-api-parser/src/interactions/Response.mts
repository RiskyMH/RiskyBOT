import { APIApplicationCommandOptionChoice, InteractionResponseType, MessageFlags, Routes, Snowflake, type APIMessage } from "discord-api-types/v10";
import { Headers, fetch } from "undici";
import { DISCORD_API_BASE_URL } from "../constants.mjs";
import BaseInteraction, { InteractionModalResponseData, InteractionResponseData } from "./BaseInteraction.mjs";


export class InteractionResponseMethods extends BaseInteraction {
    /** Reply to the interaction (within 3sec) */
    async reply(data: InteractionResponseData, fetchResponse: true): Promise<APIMessage>;
    async reply(data: InteractionResponseData, fetchResponse?: boolean): Promise<void>;
    async reply(data: InteractionResponseData, fetchResponse?: boolean): Promise<void | APIMessage> {

        const url = DISCORD_API_BASE_URL + Routes.interactionCallback(this.id, this.token);

        const body = {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: { ...data, flags: data.ephemeral ? MessageFlags.Ephemeral : null },
        };

        const res = await fetch(url, { body: JSON.stringify(body), headers: jsonHeaders, method: "POST" });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        // Clearing it from ram
        res.text();

        if (fetchResponse) return this.fetchReply();
        return;
    }

    /** Edit a response to the interaction */
    async editReply(data: InteractionResponseData, messageId: Snowflake | "@original" = "@original"): Promise<APIMessage> {

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
    async deleteReply(messageId: Snowflake | "@original" = "@original"): Promise<void> {

        const url = DISCORD_API_BASE_URL + Routes.webhookMessage(this.applicationId, this.token, messageId);

        const res = await fetch(url, { method: "DELETE" });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        // Clearing it from ram
        res.text();

        return;
    }

    /** Create a new  */
    async followUp(data: InteractionResponseData): Promise<APIMessage> {

        const url = DISCORD_API_BASE_URL + Routes.webhook(this.applicationId, this.token);

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

        const res = await fetch(url, { method: "GET" });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        return await res.json() as APIMessage;

    }

    async deferReply(data?: { ephemeral?: boolean }): Promise<void> {

        const url = DISCORD_API_BASE_URL + Routes.interactionCallback(this.id, this.token);

        const body = {
            type: InteractionResponseType.DeferredChannelMessageWithSource,
            flags: data?.ephemeral ? MessageFlags.Ephemeral : null,
        };

        const res = await fetch(url, { body: JSON.stringify(body), headers: jsonHeaders, method: "POST" });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        // Clearing it from ram
        res.text();

        return;
    }

    async showModal(data: InteractionModalResponseData): Promise<void> {

        const url = DISCORD_API_BASE_URL + Routes.interactionCallback(this.id, this.token);

        const body = {
            type: InteractionResponseType.Modal,
            data,
        };

        const res = await fetch(url, { body: JSON.stringify(body), headers: jsonHeaders, method: "POST" });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        // Clearing it from ram
        res.text();

        return;
    }

    async deferUpdate(): Promise<void> {

        const url = DISCORD_API_BASE_URL + Routes.interactionCallback(this.id, this.token);

        const body = {
            type: InteractionResponseType.DeferredMessageUpdate,
        };

        const res = await fetch(url, { body: JSON.stringify(body), headers: jsonHeaders, method: "POST" });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        // Clearing it from ram
        res.text();

        return;
    }

    async update(data: InteractionResponseData, fetchResponse: true): Promise<APIMessage>;
    async update(data: InteractionResponseData, fetchResponse?: boolean): Promise<void>;
    async update(data: InteractionResponseData, fetchResponse?: boolean): Promise<void | APIMessage> {

        const url = DISCORD_API_BASE_URL + Routes.interactionCallback(this.id, this.token);

        const body = {
            type: InteractionResponseType.UpdateMessage,
            data: { ...data, flags: data.ephemeral ? MessageFlags.Ephemeral : null },
        };

        const res = await fetch(url, { body: JSON.stringify(body), headers: jsonHeaders, method: "POST" });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        // Clearing it from ram
        res.text();

        if (fetchResponse) return this.fetchReply();
        return;
    }

    async respond(choices: APIApplicationCommandOptionChoice[]): Promise<void> {

        const url = DISCORD_API_BASE_URL + Routes.interactionCallback(this.id, this.token);

        const body = {
            type: InteractionResponseType.ApplicationCommandAutocompleteResult,
            data: {
                choices,
            }
        };

        const res = await fetch(url, { body: JSON.stringify(body), headers: jsonHeaders, method: "POST" });
        
        if (!res.ok) {
            throw new Error(await res.text());
        }
        
        // Clearing it from ram
        res.text();

        return;
    }


}

const jsonHeaders = new Headers({ "content-type": "application/json" });



/** @internal methods added in InteractionResponseMethods */
type ResponseMethodName = Exclude<keyof InteractionResponseMethods, keyof BaseInteraction>;

/**
 * Mixin helper for adding responses to an interaction. Use in in combination with
 * `createInteractionMixinList` and `applyInteractionResponseMixins`. You'll see these all around.
 *
 * More about mixins: https://www.typescriptlang.org/docs/handbook/mixins.html#alternative-pattern.
 */
export type InteractionResponseMixin<Keys extends readonly ResponseMethodName[]> = Pick<
    InteractionResponseMethods,
    Keys[number]
>;

/**
 * Returns the given argument, which is a typed list of methods from `InteractionResponseMethods`.
 */
export function createInteractionMixinList<T extends ResponseMethodName>(list: T[]): T[] {
    return list;
}

/**
 * Applies the given `methods` to `base`
 *
 * @see {InteractionResponseMixin} which explains usage.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyInteractionResponseMixins(base: any, methods: readonly ResponseMethodName[]): void {
    methods.forEach(method => {
        base.prototype[method] = InteractionResponseMethods.prototype[method];
    });
}