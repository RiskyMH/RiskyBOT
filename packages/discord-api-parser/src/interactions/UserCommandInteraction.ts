import type { APIUserApplicationCommandInteraction } from "discord-api-types/v10";
import { APIApplicationCommandInteractionDataUserOption, APIUserApplicationCommandInteractionData, ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";
import { InteractionDataResolvedGuildMember as InteractionResolvedGuildMember } from "../payloads/Member.ts";
import User from "../payloads/User.ts";
import ApplicationCommandInteraction from "./ApplicationCommandInteraction.ts";
import { Options, UserOption, formatOption } from "./ChatInputInteraction.ts";


export default class UserCommandInteraction extends ApplicationCommandInteraction {
    declare commandType: ApplicationCommandType.User;

    /** The options that the invoking user has provided for the command */
    options: UserContextMenuInteractionOption;
    /** The id of the target user */
    targetId: string;
    /** The target user */
    targetUser: User;
    /** The target member */
    targetMember?: InteractionResolvedGuildMember;

    constructor(interaction: APIUserApplicationCommandInteraction) {
        super(interaction);

        this.options = new UserContextMenuInteractionOption(interaction.data, this.guildId);
        this.targetId = interaction.data.target_id;
        this.targetUser = new User(interaction.data.resolved.users[this.targetId]);

        if (this.guildId && interaction.data.resolved.members?.[this.targetId])
            this.targetMember = new InteractionResolvedGuildMember(interaction.data.resolved.members[this.targetId], this.guildId, this.targetId);

    }

}

export class UserContextMenuInteractionOption {
    readonly options: Record<string, Options> = {};

    constructor(data: APIUserApplicationCommandInteractionData, guildId?: string) {
        const option: APIApplicationCommandInteractionDataUserOption = { type: ApplicationCommandOptionType.User, name: "user", value: data.target_id };

        this.options["user"] = formatOption(option, data.resolved, guildId);
    }


    get(name: string, required: true): Options;
    get(name: string, required?: boolean): Options | undefined;
    get(name: string, required?: boolean): Options | undefined {

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

    getMember(name: string, required: true): InteractionResolvedGuildMember;
    getMember(name: string, required?: boolean): InteractionResolvedGuildMember | undefined;
    getMember(name: string, required?: boolean): InteractionResolvedGuildMember | undefined {
        const option = this.get(name, required) as UserOption;
        return option?.member;
    }
}