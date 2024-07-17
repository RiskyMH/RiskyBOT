/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import BaseInteraction from "./BaseInteraction.ts";
import { type InteractionResponseMixin, applyInteractionResponseMixins, createInteractionMixinList } from "./Response.ts";
import type { InteractionType, ApplicationCommandType, Locale, ApplicationCommandInteractionStructure } from "lilybird";


export default class ApplicationCommandInteraction extends BaseInteraction {
    declare type: InteractionType.APPLICATION_COMMAND;
    /** The command's Id */
    commandId: string;
    /** The command's name */
    commandName: string;
    /** The type of command */
    commandType: ApplicationCommandType;
    /** If the command was a guild specific, that guild's id */
    commandGuildId?: string;
    /** The selected language of the invoking user */
    locale: Locale;

    constructor(interaction: ApplicationCommandInteractionStructure) {
        super(interaction);

        this.commandId = interaction.data!.id;
        this.commandName = interaction.data.name;
        this.commandType = interaction.data.type;
        this.commandGuildId = interaction.data.guild_id;
        this.locale = interaction.locale;

    }

}

const allowedResponses = createInteractionMixinList([
    "reply",
    "editReply",
    "deleteReply",
    "deferReply",
    "fetchReply",
    "followUp",
    "showModal"
]);

applyInteractionResponseMixins(ApplicationCommandInteraction, allowedResponses);

export default interface ApplicationCommandInteraction extends InteractionResponseMixin<typeof allowedResponses> { }
