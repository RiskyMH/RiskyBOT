import { InteractionCallbackType, MessageFlags, type MessageStructure, type ApplicationCommandOptionChoiceStructure } from "lilybird";
import { DISCORD_API_BASE_URL } from "../constants.ts";
import type { InteractionModalResponseData, InteractionResponseData } from "./BaseInteraction.ts";
import BaseInteraction from "./BaseInteraction.ts";
import type AttachmentBuilder from "../basic/AttachmentBuilder.ts";
import { DiscordRoutes } from "@riskybot/tools";


const discordPostForm = (url: string, form: FormData, method = "POST") => fetch(DISCORD_API_BASE_URL + url, { body: form, method });
const discordPost = (url: string, body: object, method = "POST") => fetch(DISCORD_API_BASE_URL + url, { body: JSON.stringify(body), headers: jsonHeaders, method });
const discordDelete = (url: string) => fetch(DISCORD_API_BASE_URL + url, { method: "DELETE" });


function addAttachmentsToForm(data: object, attachments: AttachmentBuilder[]): FormData {
    // @ts-expect-error I know that this exists
    if (data["data"]) data["data"]["attachments"] = attachments.map((attachment, index) => ({
        id: index.toString(),
        filename: attachment.name,
    }));

    // @ts-expect-error Not needed
    data["attachments"] = undefined;
    const form = new FormData();
    form.append("payload_json", JSON.stringify(data));

    // loop through data.attachments (with index)
    for (const [index, attachment] of attachments?.entries() ?? []) {
        form.append(`files[${index}]`, new Blob([attachment.file]), attachment.name);
    }

    return form;
}

export class InteractionResponseMethods extends BaseInteraction {
    /** Reply to the interaction (within 3sec) */
    async reply(data: InteractionResponseData, fetchResponse: true): Promise<MessageStructure>;
    async reply(data: InteractionResponseData, fetchResponse?: boolean): Promise<void>;
    async reply(data: InteractionResponseData, fetchResponse?: boolean): Promise<void | MessageStructure> {

        const form = addAttachmentsToForm({
            type: InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { ...data, flags: data.ephemeral ? MessageFlags.EPHEMERAL : null },
        }, data.attachments ?? []);

        const res = await discordPostForm(DiscordRoutes.interactionCallback(this.id, this.token), form);

        if (!res.ok) {
            throw new Error(await res.text());
        }

        // Clearing it from ram
        await res.text();

        if (fetchResponse) return this.fetchReply();
        return;
    }

    /** Edit a response to the interaction */
    async editReply(data: InteractionResponseData, messageId: string | "@original" = "@original"): Promise<MessageStructure> {

        const form = addAttachmentsToForm({
            // flags: data?.ephemeral ? MessageFlags.Ephemeral : null,
            ...data,
        }, data.attachments ?? []);

        const res = await discordPostForm(DiscordRoutes.webhookMessage(this.applicationId, this.token, messageId), form, "PATCH");

        if (!res.ok) {
            throw new Error(await res.text());
        }

        return res.json() as Promise<MessageStructure>;
    }

    /** Delete a reply from the interaction*/
    async deleteReply(messageId: string | "@original" = "@original"): Promise<void> {

        const res = await discordDelete(DiscordRoutes.webhookMessage(this.applicationId, this.token, messageId));

        if (!res.ok) {
            throw new Error(await res.text());
        }

        // Clearing it from ram
        res.text();

        return;
    }

    /** Create a new  */
    async followUp(data: InteractionResponseData): Promise<MessageStructure> {

        const form = addAttachmentsToForm({
            flags: data.ephemeral ? MessageFlags.EPHEMERAL : null,
            ...data,
        }, data.attachments ?? []);

        const res = await discordPost(DiscordRoutes.webhook(this.applicationId, this.token), form);

        if (!res.ok) {
            throw new Error(await res.text());
        }

        return await res.json() as MessageStructure;
    }

    async fetchReply(messageId: string | "@original" = "@original"): Promise<MessageStructure> {

        const url = DISCORD_API_BASE_URL + DiscordRoutes.webhookMessage(this.applicationId, this.token, messageId);

        const res = await fetch(url, { method: "GET" });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        return await res.json() as MessageStructure;

    }

    async deferReply(data?: { ephemeral?: boolean }): Promise<void> {

        const res = await discordPost(DiscordRoutes.interactionCallback(this.id, this.token), {
            type: InteractionCallbackType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
            flags: data?.ephemeral ? MessageFlags.EPHEMERAL : null,
        });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        // Clearing it from ram
        res.text();

        return;
    }

    async showModal(data: InteractionModalResponseData): Promise<void> {

        const res = await discordPost(DiscordRoutes.interactionCallback(this.id, this.token), {
            type: InteractionCallbackType.MODAL,
            data,
        });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        // Clearing it from ram
        res.text();

        return;
    }

    async deferUpdate(): Promise<void> {

        const res = await discordPost(DiscordRoutes.interactionCallback(this.id, this.token), {
            type: InteractionCallbackType.DEFERRED_UPDATE_MESSAGE,
        });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        // Clearing it from ram
        res.text();

        return;
    }

    async update(data: InteractionResponseData, fetchResponse: true): Promise<MessageStructure>;
    async update(data: InteractionResponseData, fetchResponse?: boolean): Promise<void>;
    async update(data: InteractionResponseData, fetchResponse?: boolean): Promise<void | MessageStructure> {

        const form = addAttachmentsToForm({
            type: InteractionCallbackType.UPDATE_MESSAGE,
            data: { ...data, flags: data.ephemeral ? MessageFlags.EPHEMERAL : null },
        }, data.attachments ?? []);

        const res = await discordPostForm(DiscordRoutes.interactionCallback(this.id, this.token), form);

        if (!res.ok) {
            throw new Error(await res.text());
        }

        // Clearing it from ram
        res.text();

        if (fetchResponse) return this.fetchReply();
        return;
    }

    async respond(choices: ApplicationCommandOptionChoiceStructure[]): Promise<void> {

        const res = await discordPost(DiscordRoutes.interactionCallback(this.id, this.token), {
            type: InteractionCallbackType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
            data: {
                choices,
            }
        });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        // Clearing it from ram
        res.text();

        return;
    }

}

const jsonHeaders = new Headers({ "content-type": "application/json" });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const consume = (any: any) => any;


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
    for (const method of methods) {
        base.prototype[method] = InteractionResponseMethods.prototype[method];
    }
}
