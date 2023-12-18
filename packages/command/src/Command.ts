/* eslint-disable @typescript-eslint/no-unused-vars */
import type { AutocompleteInteraction, ModalSubmitInteraction, ApplicationCommandInteraction, MessageComponentInteraction } from "discord-api-parser";
import type { POSTApplicationCommandStructure } from "lilybird";

export default abstract class Command {
    name!: string;
    aliases?: string[];
    description!: string;

    command!: POSTApplicationCommandStructure;
    userCommand?: POSTApplicationCommandStructure;
    messageCommand?: POSTApplicationCommandStructure;

    namePrefix?: string;

    ownerOnly = false;

    // @ts-expect-error - unused because it's abstract
    async handleApplicationCommand(interaction: ApplicationCommandInteraction) {
        throw new Error("not implemented");
    }

    // @ts-expect-error - unused because it's abstract
    async handleMessageComponent(interaction: MessageComponentInteraction) {
        throw new Error("not implemented");
    }

    // @ts-expect-error - unused because it's abstract
    async handleModalSubmit(interaction: ModalSubmitInteraction) {
        throw new Error("not implemented");
    }

    // @ts-expect-error - unused because it's abstract
    override async handleAutoComplete(interaction: AutocompleteInteraction) {
        throw new Error("not implemented");
    }

}
