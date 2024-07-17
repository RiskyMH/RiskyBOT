import { type ApplicationCommandType, type InteractionType, type Locale, type ApplicationCommandInteractionStructure, type ApplicationCommandInteractionDataOptionStructure, type ResolvedDataStructure, ApplicationCommandOptionType } from "lilybird";
import BaseInteraction from "./BaseInteraction.ts";
import type { AttachmentOption, BooleanOption, ChannelOption, IntegerOption, MentionableOption, NumberOption, RoleOption, StringOption, UserOption } from "./ChatInputInteraction.ts";
import { ChatInputInteractionOption } from "./ChatInputInteraction.ts";
import { applyInteractionResponseMixins, createInteractionMixinList, type InteractionResponseMixin } from "./Response.ts";


export default class AutocompleteInteraction extends BaseInteraction {
    declare type: InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE;

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
    /** The options that the invoking user has provided for the command */
    options: AutocompleteOptions;

    constructor(interaction: ApplicationCommandInteractionStructure) {
        super(interaction);

        this.commandId = interaction.data.id;
        this.commandName = interaction.data.name;
        this.commandType = interaction.data.type;
        this.commandGuildId = interaction.data.guild_id;
        this.locale = interaction.locale;
        this.options = new AutocompleteOptions(interaction.data.options, interaction.data.resolved, this.guildId);
    }
    
}

const allowedResponses = createInteractionMixinList([
    "respond"
]);

applyInteractionResponseMixins(AutocompleteInteraction, allowedResponses);

export default interface ApplicationCommandInteraction extends InteractionResponseMixin<typeof allowedResponses> {}

export type AutocompleteOptionsType = (StringOption | NumberOption | UserOption | RoleOption | BooleanOption | IntegerOption | ChannelOption | AttachmentOption | MentionableOption) & {focused?: boolean};

export class AutocompleteOptions extends ChatInputInteractionOption {
    declare readonly options: Record<string, AutocompleteOptionsType>;
    
    constructor(options?: ApplicationCommandInteractionDataOptionStructure[], resolved?: ResolvedDataStructure, guildId?: string) {
        super(options, resolved, guildId);
        
        // Add focused option to all options
        for (const option in this.options) {
            let foundOption = options?.find(o => o.name === option);
            
            if (ApplicationCommandOptionType.SUB_COMMAND === options?.[0]?.type) {
                foundOption = options[0].options?.find(o => o.name === option);
            }
            else if (ApplicationCommandOptionType.SUB_COMMAND_GROUP === options?.[0]?.type) {
                foundOption = options?.[0]?.options?.[0]?.options?.find(o => o.name === option); 
            }

            this.options[option].focused = foundOption?.focused;
        }
    }
    
    isFocused(name: string): boolean | undefined {
        return this.options[name].focused;
    }

}
