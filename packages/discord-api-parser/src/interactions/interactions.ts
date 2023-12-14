import { ApplicationCommandType, ComponentType, InteractionType, type APIInteraction } from "discord-api-types/v10";
import AutocompleteInteraction from "./AutocompleteInteraction.ts";
import BaseInteraction from "./BaseInteraction.ts";
import ButtonInteraction from "./ButtonComponentInteraction.ts";
import ChatInputInteraction from "./ChatInputInteraction.ts";
import MessageCommandInteraction from "./MessageCommandInteraction.ts";
import ModalSubmitInteraction from "./ModalSubmitInteraction.ts";
import PingInteraction from "./PingInteraction.ts";
import SelectMenuInteraction from "./SelectMenuComponentInteraction.ts";
import UserContextMenuInteraction from "./UserCommandInteraction.ts";


/**
 * The Interaction :)
 */
export type Interaction = PingInteraction | ChatInputInteraction | UserContextMenuInteraction | ButtonInteraction | SelectMenuInteraction | AutocompleteInteraction | MessageCommandInteraction | ModalSubmitInteraction;


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
    type AutocompleteOptionsType as AutocompleteInteractionOptionsType, default as AutocompleteInteraction
} from "./AutocompleteInteraction.ts";
export * from "./BaseInteraction.ts";
export {
    ChatInputInteractionOption as ChatInputInteractionOption,
    AttachmentOption as InteractionCommandAttachmentOption,
    BaseOption as InteractionCommandBaseOption,
    BooleanOption as InteractionCommandBooleanOption,
    ChannelOption as InteractionCommandChannelOption,
    formatOption as InteractionCommandFormatOption,
    IntegerOption as InteractionCommandIntegerOption,
    type MentionableOption as InteractionCommandMentionableOption,
    NumberOption as InteractionCommandNumberOption, 
    type Options as InteractionCommandOptions,
    RoleOption as InteractionCommandRoleOption,
    StringOption as InteractionCommandStringOption,
    UserOption as InteractionCommandUserOption, 
    default as ChatInputInteraction
} from "./ChatInputInteraction.ts";
export {
    MessageOption as MessageCommandInteractionOption,
    MessageContextMenuInteractionOption as MessageContextMenuInteractionOption, default as MessageCommandInteraction
} from "./MessageCommandInteraction.ts";
export {
    type ModalMessageModalSubmitInteraction,
    BaseField as ModalSubmitInteractionBaseField,
    ModalSubmitFields as ModalSubmitInteractionFields,
    type fields as ModalSubmitInteractionFieldsType,
    TextInputOption as ModalSubmitInteractionTextInputOption, default as ModalSubmitInteraction
} from "./ModalSubmitInteraction.ts";


export {default as ApplicationCommandInteraction} from "./ApplicationCommandInteraction.ts";
export {default as MessageComponentInteraction} from "./MessageComponentInteraction.ts";
export {default as BaseInteraction} from "./BaseInteraction.ts";
export {default as PingInteraction} from "./PingInteraction.ts";
export {default as SelectMenuInteraction} from "./SelectMenuComponentInteraction.ts";
export {default as UserContextMenuInteraction} from "./UserCommandInteraction.ts";
export {default as ButtonInteraction} from "./ButtonComponentInteraction.ts";