import { APIApplicationCommandAutocompleteInteraction, APIApplicationCommandInteractionDataOption, APIInteractionDataResolved, ApplicationCommandOptionType, ApplicationCommandType, InteractionType, LocaleString, Snowflake } from "discord-api-types/v10";
import BaseInteraction from "./BaseInteraction.mjs";
import { AttachmentOption, BooleanOption, ChannelOption, ChatInputInteractionOption, IntegerOption, MentionableOption, NumberOption, RoleOption, StringOption, UserOption } from "./ChatInputInteraction.mjs";
import { InteractionResponseMixin, applyInteractionResponseMixins, createInteractionMixinList } from "./Response.mjs";


export default class AutocompleteInteraction extends BaseInteraction {
    declare type: InteractionType.ApplicationCommandAutocomplete;

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
    /** The options that the invoking user has provided for the command */
    options: AutocompleteOptions;

    constructor(interaction: APIApplicationCommandAutocompleteInteraction) {
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
    
    constructor(options: APIApplicationCommandInteractionDataOption[] | undefined, resolved: APIInteractionDataResolved | undefined, guildId?: string) {
        super(options, resolved, guildId);
        
        // Add focused option to all options
        for (const option in this.options) {
            let foundOption = options?.find(o => o.name === option);
            
            if (ApplicationCommandOptionType.Subcommand === options?.[0]?.type) {
                foundOption = options[0].options?.find(o => o.name === option);
            }
            else if (ApplicationCommandOptionType.SubcommandGroup === options?.[0]?.type) {
                foundOption = options?.[0]?.options?.[0]?.options?.find(o => o.name === option); 
            }

            // @ts-expect-error - this is a valid option type
            this.options[option].focused = foundOption?.focused;
        }
    }
    
    isFocused(name: string): boolean | undefined {
        return this.options[name].focused;
    }

}
