/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import type { APIApplicationCommandInteraction, ApplicationCommandType, InteractionType, LocaleString, Snowflake } from "discord-api-types/v10";
import BaseInteraction from "./BaseInteraction.mjs";
import { InteractionResponseMixin, applyInteractionResponseMixins, createInteractionMixinList } from "./Response.mjs";


export default class ApplicationCommandInteraction extends BaseInteraction {
    declare type: InteractionType.ApplicationCommand;
    /** The command's Id */
    commandId: Snowflake;
    /** The command's name */
    commandName: string;
    /** The type of command */
    commandType: ApplicationCommandType;
    /** If the command was a guild specific, that guild's id */
    commandGuildId?: Snowflake;
    /** The selected language of the invoking user */
    locale: LocaleString;

    constructor(interaction: APIApplicationCommandInteraction) {
        super(interaction);

        this.commandId = interaction.data.id;
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
