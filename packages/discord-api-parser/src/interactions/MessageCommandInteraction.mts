import { APIMessageApplicationCommandInteraction, APIMessageApplicationCommandInteractionData, ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";
import type Message from "../payloads/Message.mjs";
import ApplicationCommandInteraction from "./ApplicationCommandInteraction.mjs";
import { BaseOption, type Options } from "./ChatInputInteraction.mjs";


export default class MessageCommandInteraction extends ApplicationCommandInteraction {
    declare commandType: ApplicationCommandType.Message;

    /** The options that the invoking user has provided for the command */
    options: MessageContextMenuInteractionOption;
    /** The id of the target user */
    targetId: string;
    /** The target user */
    targetMessage: Message;

    constructor(interaction: APIMessageApplicationCommandInteraction) {
        super(interaction);
        this.options = new MessageContextMenuInteractionOption(interaction.data);

        this.targetId = interaction.data.target_id;
        this.targetMessage = interaction.data.resolved.messages[this.targetId];
    }

    isMessageCommand(): true {
        return true;
    }

}

export class MessageOption extends BaseOption {
    declare type: ApplicationCommandOptionType;
    declare value: string;
    message: Message;

    constructor(name: string, value: string, message: Message) {
        super(ApplicationCommandOptionType.Attachment, name, value);
        this.message = message;
    }
}


export class MessageContextMenuInteractionOption {
    readonly options: Record<string, Options> = {};

    constructor(data: APIMessageApplicationCommandInteractionData) {
 
        // const message = new Message(data.resolved.messages[data.target_id]);
        const message = data.resolved.messages[data.target_id];
        this.options["message"] = new MessageOption("message", data.target_id, message);
    }

    
    get(name: string, required: true): Options;
    get(name: string, required?: boolean): Options | undefined;
    get(name: string, required?: boolean): Options | undefined {

        const option = this.options["message"];

        if (required && !option) {
            throw new Error(`Option ${name} is required`);
        }

        return option;
    }

    getMessage(name: string, required: true): Message;
    getMessage(name: string, required?: boolean): Message | undefined;
    getMessage(name: string, required?: boolean): Message | undefined {
        const option = this.get(name, required) as MessageOption;
        return option?.message;
    }
    
}