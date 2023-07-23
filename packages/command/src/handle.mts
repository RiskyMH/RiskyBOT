import { Interaction } from "discord-api-parser";
import Command from "./Command.mjs";
import { InteractionType } from "discord-api-types/v10";


export default function handleInteraction(interaction: Interaction, commands: Command[]) {
    // Nothing really interesting, just to see what commands used
    if (interaction.isChatInputCommand() && interaction.commandName) {
        if (interaction.options && interaction.options.getSubcommand(false)) {
            console.info(`SLASH: ${interaction.commandName} (${interaction.options.getSubcommand()})`);
        }
        else {
            console.info(`SLASH: ${interaction.commandName}`);
        }
    }
    else if ((interaction.isUserCommand() || interaction.isMessageCommand()) && interaction.commandName) {
        console.info(`CONTEXT: ${interaction.commandName}`);
    }
    else if (interaction.isButton() && interaction.customId) {
        console.info(`BUTTON: ${interaction.customId.split("-")[0]}`);
    }
    else if (interaction.isSelectMenu() && interaction.customId) {
        console.info(`SELECT: ${interaction.customId.split("-")[0]}`);
    }
    else if (interaction.isModalSubmit() && interaction.customId) {
        console.info(`MODAL: ${interaction.customId.split("-")[0]}`);
    }
    else if (interaction.isAutocomplete() && interaction.commandName) {
        console.info(`AUTOCOMPLETE: ${interaction.commandName}`);
    }
    else if (interaction.type === InteractionType.Ping) {
        console.info("PING");
    }
    else {
        console.info(`UNKNOWN: ${interaction.type}`);
    }


    // Handle the interaction
    if (interaction.isChatInputCommand()) {
        const command = commands.find(command => command.name === interaction.commandName);
        if (command) {
            return command.handleApplicationCommand(interaction);
        }
    }

    else if (interaction.isUserCommand()) {
        const command = commands.find(command => command.userCommandName === interaction.commandName);
        if (command) {
            return command.handleApplicationCommand(interaction);
        }
    }

    else if (interaction.isMessageCommand()) {
        const command = commands.find(command => command.messageCommandName === interaction.commandName);
        if (command) {
            return command.handleApplicationCommand(interaction);
        }
    }

    else if (interaction.isMessageComponent()) {
        const command = commands.find(command => command.namePrefix === interaction.customId.split(":")[0]);
        if (command) {
            return command.handleMessageComponent(interaction);
        }
    }

    else if (interaction.isModalSubmit()) {
        const command = commands.find(command => command.namePrefix === interaction.customId.split(":")[0]);
        if (command) {
            return command.handleModalSubmit(interaction);
        }
    }

    else if (interaction.isAutocomplete()) {
        const command = commands.find(command => command.name === interaction.commandName.split(":")[0]);
        if (command) {
            return command.handleAutoComplete(interaction);
        }
    }

    else if (interaction.type === InteractionType.Ping) {
        // Nothing to do here
        return;
    }

    else {
        return;
    }
    
    return;


}
