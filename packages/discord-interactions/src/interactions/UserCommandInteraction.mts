import { ApplicationCommandType, APIUserApplicationCommandInteractionData, ApplicationCommandOptionType, APIApplicationCommandInteractionDataUserOption } from "discord-api-types/v10";
import type { APIUserApplicationCommandInteraction } from "discord-api-types/v10";
import type { InteractionDataResolvedGuildMember } from "../basic/Member.mjs";
import type User from "../basic/User.mjs";
import ApplicationCommandInteraction from "./ApplicationCommandInteraction.mjs";
import { formatOption, options, UserOption } from "./ChatInputInteraction.mjs";


export default class UserCommandInteraction extends ApplicationCommandInteraction {
  declare commandType: ApplicationCommandType.User;

  /** The options that the invoking user has provided for the command */
  options: UserContextMenuInteractionOption;

  constructor(interaction: APIUserApplicationCommandInteraction) {
    super(interaction);

    this.options = new UserContextMenuInteractionOption(interaction.data, this.guildId);
    
  }

  isUserCommand(): true {
    return true;
  }

}

class UserContextMenuInteractionOption {
    readonly options: {[key: string]: options} = {};

    constructor(data: APIUserApplicationCommandInteractionData, guildId?: string) {
        const option: APIApplicationCommandInteractionDataUserOption = {type: ApplicationCommandOptionType.User, name: "user", value: data.target_id};
  
        this.options["user"] = formatOption(option, data.resolved, guildId);  
    }

    
    get(name: string, required: true): options;
    get(name: string, required?: boolean): options | undefined;
    get(name: string, required?: boolean): options | undefined {

        const option = this.options["user"];

        if (required && !option) {
            throw new Error(`Option ${name} is required`);
        }

        return option;
    }

    getUser(name: string, required: true): User;
    getUser(name: string, required?: boolean): User | undefined;
    getUser(name: string, required?: boolean): User | undefined {
        const option = this.get(name, required) as UserOption;
        return option?.user;
    }
    
    getMember(name: string, required: true): InteractionDataResolvedGuildMember;
    getMember(name: string, required?: boolean): InteractionDataResolvedGuildMember | undefined;
    getMember(name: string, required?: boolean): InteractionDataResolvedGuildMember | undefined {
        const option = this.get(name, required) as UserOption;
        return option?.member;
    }    
}