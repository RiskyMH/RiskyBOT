import { ApplicationCommandOptionType, type ApplicationCommandDataStructure, type ApplicationCommandInteractionStructure, type ApplicationCommandType, type MessageStructure } from "lilybird";
import ApplicationCommandInteraction from "./ApplicationCommandInteraction.ts";
import { BaseOption, type Options } from "./ChatInputInteraction.ts";


export default class MessageCommandInteraction extends ApplicationCommandInteraction {
    declare commandType: ApplicationCommandType.MESSAGE;

    /** The options that the invoking user has provided for the command */
    options: MessageContextMenuInteractionOption;
    /** The id of the target user */
    targetId: string;
    /** The target user */
    targetMessage: Partial<MessageStructure>;

    constructor(interaction: ApplicationCommandInteractionStructure) {
        super(interaction);
        this.options = new MessageContextMenuInteractionOption(interaction.data);

        this.targetId = interaction.data.target_id!;
        this.targetMessage = interaction.data.resolved!.messages![this.targetId]!;
    }

}

export class MessageOption extends BaseOption {
    declare type: ApplicationCommandOptionType;
    declare value: string;
    message: Partial<MessageStructure>;

    constructor(name: string, value: string, message: Partial<MessageStructure>) {
        super(ApplicationCommandOptionType.ATTACHMENT, name, value);
        this.message = message;
    }
}


export class MessageContextMenuInteractionOption {
    readonly options: Record<string, Options> = {};

    constructor(data: ApplicationCommandDataStructure) {

        // const message = new Message(data.resolved.messages[data.target_id]);
        const message = data.resolved!.messages![data.target_id!];
        this.options["message"] = new MessageOption("message", data.target_id!, message);
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

    getMessage(name: string, required: true): Partial<MessageStructure>;
    getMessage(name: string, required?: boolean): Partial<MessageStructure> | undefined;
    getMessage(name: string, required?: boolean): Partial<MessageStructure> | undefined {
        const option = this.get(name, required) as MessageOption;
        return option?.message;
    }

}