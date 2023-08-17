import { ApplicationCommandType, ComponentType, InteractionResponseType, InteractionType, type APIInteraction } from "discord-api-types/v10";
import { PlatformAlgorithm, verify } from "discord-verify";
import crypto from "node:crypto";
import AutocompleteInteraction from "./AutocompleteInteraction.mjs";
import BaseInteraction from "./BaseInteraction.mjs";
import ButtonInteraction from "./ButtonComponentInteraction.mjs";
import ChatInputInteraction from "./ChatInputInteraction.mjs";
import MessageCommandInteraction from "./MessageCommandInteraction.mjs";
import ModalSubmitInteraction from "./ModalSubmitInteraction.mjs";
import PingInteraction from "./PingInteraction.mjs";
import SelectMenuInteraction from "./SelectMenuComponentInteraction.mjs";
import UserContextMenuInteraction from "./UserCommandInteraction.mjs";


/**
 * The Interaction :)
 */
export type Interaction = PingInteraction | ChatInputInteraction | UserContextMenuInteraction | ButtonInteraction | SelectMenuInteraction | AutocompleteInteraction | MessageCommandInteraction | ModalSubmitInteraction;


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function verifyInteraction(request: any, response: any, publicKey: string): Promise<boolean> {
    if (request.method !== "POST") {
        response.statusCode = 405;
        response.send({ error: "Only can use POST method" });
        return false;
    }

    const signature = request.headers["x-signature-ed25519"]?.toString();
    const timestamp = request.headers["x-signature-timestamp"]?.toString();
    const rawBody = JSON.stringify(request.body);

    if (!signature || !timestamp || !rawBody) {
        response.statusCode = 405;
        response.send({ error: "Invalid headers and/or body" });
        return false;
    }

    let isValidRequest = false;
    try {
        isValidRequest = await verify(rawBody, signature, timestamp, publicKey, crypto.webcrypto.subtle);
    } catch {
        isValidRequest = await verify(rawBody, signature, timestamp, publicKey, crypto.webcrypto.subtle, PlatformAlgorithm.OldNode);
        console.warn("Fallback to discord-verify (old node)");
    }


    if (!isValidRequest) {
        response.statusCode = 401;
        response.send({ error: "Bad request signature" });
        return false;
    }

    const interaction = request.body as APIInteraction;

    // Handle PINGs from Discord
    if (interaction.type === InteractionType.Ping) {
        console.info("Handling Ping request");

        response.send({ type: InteractionResponseType.Pong });
        return true;
    }

    return true;


}


export function parseRawInteraction(data: APIInteraction): Interaction {
    let InteractionClass = BaseInteraction;

    switch (data.type) {
        case InteractionType.Ping: {
            InteractionClass = PingInteraction;
            break;
        }

        case InteractionType.ApplicationCommand: {
            switch (data.data.type) {
                case ApplicationCommandType.ChatInput: {
                    InteractionClass = ChatInputInteraction;
                    break;
                }

                case ApplicationCommandType.User: {
                    InteractionClass = UserContextMenuInteraction;
                    break;
                }

                case ApplicationCommandType.Message: {
                    InteractionClass = MessageCommandInteraction;
                    break;
                }

                default: {
                    // @ts-expect-error Never should occur, but just in case
                    throw new Error("Unknown ApplicationCommandType: " + data.data.type);
                }
            }
            break;
        }

        case InteractionType.ApplicationCommandAutocomplete: {
            InteractionClass = AutocompleteInteraction;
            break;
        }

        case InteractionType.MessageComponent: {
            switch (data.data.component_type) {
                case ComponentType.Button: {
                    InteractionClass = ButtonInteraction;
                    break;
                }

                // Later TODO: Implement these select menus better
                case ComponentType.RoleSelect:
                case ComponentType.UserSelect:
                case ComponentType.ChannelSelect:
                case ComponentType.MentionableSelect:
                case ComponentType.StringSelect: {
                    InteractionClass = SelectMenuInteraction;
                    break;
                }

                default: {
                    // @ts-expect-error Never should occur, but just in case
                    throw new Error("Unknown ComponentType: " + data.data.component_type);
                }
            }
            break;
        }

        case InteractionType.ModalSubmit: {
            InteractionClass = ModalSubmitInteraction;
            break;
        }

        default: {
            // @ts-expect-error Never should occur, but just in case
            throw new Error("Unknown InteractionType: " + data.type);
        }
    }

    return new InteractionClass(data) as Interaction;
}



export {
    AutocompleteOptions as AutocompleteInteractionOptions,
    AutocompleteOptionsType as AutocompleteInteractionOptionsType, default as AutocompleteInteraction
} from "./AutocompleteInteraction.mjs";
export * from "./BaseInteraction.mjs";
export {
    ChatInputInteractionOption as ChatInputInteractionOption,
    AttachmentOption as InteractionCommandAttachmentOption,
    BaseOption as InteractionCommandBaseOption,
    BooleanOption as InteractionCommandBooleanOption,
    ChannelOption as InteractionCommandChannelOption,
    formatOption as InteractionCommandFormatOption,
    IntegerOption as InteractionCommandIntegerOption,
    MentionableOption as InteractionCommandMentionableOption,
    NumberOption as InteractionCommandNumberOption, Options as InteractionCommandOptions,
    RoleOption as InteractionCommandRoleOption,
    StringOption as InteractionCommandStringOption,
    UserOption as InteractionCommandUserOption, default as ChatInputInteraction
} from "./ChatInputInteraction.mjs";
export {
    MessageOption as MessageCommandInteractionOption,
    MessageContextMenuInteractionOption as MessageContextMenuInteractionOption, default as MessageCommandInteraction
} from "./MessageCommandInteraction.mjs";
export {
    ModalMessageModalSubmitInteraction as ModalMessageModalSubmitInteraction,
    BaseField as ModalSubmitInteractionBaseField,
    ModalSubmitFields as ModalSubmitInteractionFields,
    fields as ModalSubmitInteractionFieldsType,
    TextInputOption as ModalSubmitInteractionTextInputOption, default as ModalSubmitInteraction
} from "./ModalSubmitInteraction.mjs";


export {default as ApplicationCommandInteraction} from "./ApplicationCommandInteraction.mjs";
export {default as MessageComponentInteraction} from "./MessageComponentInteraction.mjs";
export {default as BaseInteraction} from "./BaseInteraction.mjs";
export {default as PingInteraction} from "./PingInteraction.mjs";
export {default as SelectMenuInteraction} from "./SelectMenuComponentInteraction.mjs";
export {default as UserContextMenuInteraction} from "./UserCommandInteraction.mjs";
export {default as ButtonInteraction} from "./ButtonComponentInteraction.mjs";