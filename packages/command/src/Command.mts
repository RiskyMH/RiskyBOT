/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ContextMenuCommandBuilder, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import type { ApplicationCommandInteraction, AutocompleteInteraction, MessageComponentInteraction, ModalSubmitInteraction } from "discord-api-parser";


export default abstract class Command {
    name!: string;
    description!: string;

    command!: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder;
    userCommand?: ContextMenuCommandBuilder;
    messageCommand?: ContextMenuCommandBuilder;

    userCommandName?: string;
    messageCommandName?: string;
    namePrefix?: string;

    ownerOnly = false;


    async handleApplicationCommand(interaction: ApplicationCommandInteraction) {
        throw new Error("not implemented");
    }

    async handleMessageComponent(interaction: MessageComponentInteraction) {
        throw new Error("not implemented");
    }

    async handleModalSubmit(interaction: ModalSubmitInteraction) {
        throw new Error("not implemented");
    }

    async handleAutoComplete(interaction: AutocompleteInteraction) {
        throw new Error("not implemented");
    }

}
