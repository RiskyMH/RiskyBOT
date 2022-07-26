import { APIApplicationCommandAutocompleteInteraction, APIApplicationCommandInteractionDataOption, APIApplicationCommandOptionChoice, APIChatInputApplicationCommandInteractionDataResolved, ApplicationCommandOptionType, ApplicationCommandType, InteractionResponseType, InteractionType, LocaleString, Routes, Snowflake } from "discord-api-types/v10";
import { fetch, Headers } from "undici";
import { DISCORD_API_BASE_URL } from "../constants.mjs";
import { AttachmentOption, BooleanOption, ChannelOption, ChatInputInteractionOption, IntegerOption, MentionableOption, NumberOption, RoleOption, StringOption, UserOption } from "./ChatInputInteraction.mjs";
import BaseInteraction from "./Interaction.mjs";


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

    isAutocomplete(): true {
        return true;
    }


    async respond(choices: APIApplicationCommandOptionChoice[]): Promise<void> {

        const url = DISCORD_API_BASE_URL+ Routes.interactionCallback(this.id, this.token);

        const body = {
            type: InteractionResponseType.ApplicationCommandAutocompleteResult,
            data: {
                choices,
            }
        };
        
        await fetch(url, { body: JSON.stringify(body), headers: jsonHeaders, method: "POST" });
        
        return;
    }

    
}

const jsonHeaders = new Headers({ "content-type": "application/json" });


type AutocompleteOptionsType = (StringOption | NumberOption | UserOption | RoleOption | BooleanOption | IntegerOption | ChannelOption | AttachmentOption | MentionableOption) & {focused?: boolean};

class AutocompleteOptions extends ChatInputInteractionOption {
    declare readonly options: {[key: string]: AutocompleteOptionsType};
    
    constructor(options: APIApplicationCommandInteractionDataOption[] | undefined, resolved: APIChatInputApplicationCommandInteractionDataResolved | undefined, guildId?: string) {
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