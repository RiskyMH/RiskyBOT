import { APIApplicationCommandInteractionDataOption, APIChatInputApplicationCommandInteraction, ApplicationCommandOptionType, APIChatInputApplicationCommandInteractionDataResolved, ApplicationCommandType, APIAttachment } from "discord-api-types/v10";
import { InteractionDataResolvedChannel } from "../basic/Channel.mjs";
import { InteractionDataResolvedGuildMember } from "../basic/Member.mjs";
import Role from "../basic/Role.mjs";
import { User } from "../index.mjs";
import ApplicationCommandInteraction from "./ApplicationCommandInteraction.mjs";
import type { MessageOption } from "./MessageCommandInteraction.mjs";


export default class ChatInputInteraction extends ApplicationCommandInteraction {
    declare commandType: ApplicationCommandType.ChatInput;
    /** The options that the invoking user has provided for the command */
    options: ChatInputInteractionOption;

    constructor(interaction: APIChatInputApplicationCommandInteraction) {
        super(interaction);

        this.options = new ChatInputInteractionOption(interaction.data.options, interaction.data.resolved, this.guildId);
        
    }

    isChatInputCommand(): true {
        return true;      
    }

}

export type options = StringOption | NumberOption | UserOption | RoleOption | BooleanOption | IntegerOption | ChannelOption | AttachmentOption | MentionableOption | MessageOption;

export class BaseOption {
    type: ApplicationCommandOptionType;
    name: string;
    value: string | number | boolean;

    constructor(type: ApplicationCommandOptionType, name: string, value: string | number | boolean) {
        this.type = type;
        this.name = name;
        this.value = value;
    }
}

export class StringOption extends BaseOption {
    declare type: ApplicationCommandOptionType.String;
    declare value: string;

    constructor(name: string, value: string) {
        super(ApplicationCommandOptionType.String, name, value);
    }
}

export class NumberOption extends BaseOption {
    declare type: ApplicationCommandOptionType.Number;
    declare value: number;

    constructor(name: string, value: number) {
        super(ApplicationCommandOptionType.Number, name, value);
    }
}

export class IntegerOption extends BaseOption {
    declare type: ApplicationCommandOptionType.Number;
    declare value: number;

    constructor(name: string, value: number) {
        super(ApplicationCommandOptionType.Number, name, value);
    }

}

export class BooleanOption extends BaseOption {
    declare type: ApplicationCommandOptionType.Boolean;
    declare value: boolean;

    constructor(name: string, value: boolean) {
        super(ApplicationCommandOptionType.Boolean, name, value);
    }
}

export class UserOption extends BaseOption {
    declare type: ApplicationCommandOptionType.User;
    declare value: string;
    user: User;
    member?: InteractionDataResolvedGuildMember;

    constructor(name: string, value: string, user: User, member?: InteractionDataResolvedGuildMember) {
        super(ApplicationCommandOptionType.User, name, value);
        this.user = user;
        this.member = member;
    }
}

export class RoleOption extends BaseOption {
    declare type: ApplicationCommandOptionType.Role;
    declare value: string;
    role: Role;

    constructor(name: string, value: string, role: Role) {
        super(ApplicationCommandOptionType.Role, name, value);
        this.role = role;
    }
}

export type MentionableOption = UserOption | RoleOption;

export class ChannelOption extends BaseOption {
    declare type: ApplicationCommandOptionType.Channel;
    declare value: string;
    channel: InteractionDataResolvedChannel;

    constructor(name: string, value: string, channel: InteractionDataResolvedChannel) {
        super(ApplicationCommandOptionType.Channel, name, value);
        this.channel = channel;
    }
}

export class AttachmentOption extends BaseOption {
    declare type: ApplicationCommandOptionType.Attachment;
    declare value: string;
    attachment: APIAttachment;

    constructor(name: string, value: string, attachment: APIAttachment) {
        super(ApplicationCommandOptionType.Attachment, name, value);
        this.attachment = attachment;
    }
}


export function formatOption (option: APIApplicationCommandInteractionDataOption, resolved: APIChatInputApplicationCommandInteractionDataResolved | undefined, guildId?: string) : options {

    if (option.type === ApplicationCommandOptionType.String) {
        return new StringOption(option.name, option.value);
    }

    if (option.type === ApplicationCommandOptionType.Number) {
        return new NumberOption(option.name, option.value);
    }

    if (option.type === ApplicationCommandOptionType.Integer) {
        return new IntegerOption(option.name, option.value);
    }

    if (option.type === ApplicationCommandOptionType.Boolean) {
        return new BooleanOption(option.name, option.value);
    }

    if (option.type === ApplicationCommandOptionType.User) {
        const user = resolved?.users?.[option.value];
        const member = resolved?.members?.[option.value];

        if (user) {
            const resolvedUser = new User(user);
            const resolvedMember = member && guildId ? new InteractionDataResolvedGuildMember(member, guildId, user.id) : undefined;
            return new UserOption(option.name, option.value, resolvedUser, resolvedMember);
        }
    }

    if (option.type === ApplicationCommandOptionType.Role) {
        const role = resolved?.roles?.[option.value];

        if (role) {
            const resolvedRole = new Role(role);
            return new RoleOption(option.name, option.value, resolvedRole);
        }
    }

    if (option.type === ApplicationCommandOptionType.Channel) {
        const channel = resolved?.channels?.[option.value];

        if (channel) {
            const resolvedChannel = new InteractionDataResolvedChannel(channel);
            return new ChannelOption(option.name, option.value, resolvedChannel);
        }
    }

    if (option.type === ApplicationCommandOptionType.Attachment) {
        const attachment = resolved?.attachments?.[option.value];

        if (attachment) {
            const resolvedAttachment = attachment;
            return new AttachmentOption(option.name, option.value, resolvedAttachment);
        }
    }

    if (option.type === ApplicationCommandOptionType.Mentionable) {
        const role = resolved?.roles?.[option.value];
        const user = resolved?.users?.[option.value];
        const member = resolved?.members?.[option.value];

        if (role) {
            const resolvedRole = new Role(role);
            return new RoleOption(option.name, option.value, resolvedRole);
        }
        else if (user) {
            const resolvedUser = new User(user);
            const resolvedMember = member && guildId ? new InteractionDataResolvedGuildMember(member, guildId, user.id) : undefined;
            return new UserOption(option.name, option.value, resolvedUser, resolvedMember);
        }

    }

    return new StringOption(option.name, "Unknown");

}


export class ChatInputInteractionOption {
    readonly options: {[key: string]: options} = {};
    readonly subCommands: {subCommand?: string, subCommandGroup?: string} = {};

    constructor(options: APIApplicationCommandInteractionDataOption[] | undefined, resolved: APIChatInputApplicationCommandInteractionDataResolved | undefined, guildId?: string) {

        for (const option of options || []) {

            if (ApplicationCommandOptionType.Subcommand !== option.type && ApplicationCommandOptionType.SubcommandGroup !== option.type) {
                this.options[option.name] = formatOption(option, resolved, guildId);  
            }
            
            else if (option.type === ApplicationCommandOptionType.Subcommand) {
                this.subCommands.subCommand = option.name;
                for (const subOption of option.options || []) {
                    this.options[subOption.name] = formatOption(subOption, resolved, guildId);
                }
            }

            else if (option.type === ApplicationCommandOptionType.SubcommandGroup) {
                this.subCommands.subCommandGroup = option.name;
                for (const subOption of option.options || []) {
                    this.subCommands.subCommand = subOption.name;
                    for (const subSubOption of subOption.options || []) {
                        this.options[subOption.name] = formatOption(subSubOption, resolved, guildId);
                    }
                }
            }
        }
    }

    
    get(name: string, required: true): options;
    get(name: string, required?: boolean): options | undefined;
    get(name: string, required?: boolean): options | undefined {

        const option = this.options[name];

        if (required && !option) {
            throw new Error(`Option ${name} is required`);
        }

        return option;
    }

    getString(name: string, required: true): string 
    getString(name: string, required?: boolean): string | undefined 
    getString(name: string, required?: boolean): string | undefined {
        
        return this.get(name, required)?.value as string;
    }

    getBoolean(name: string, required: true): boolean
    getBoolean(name: string, required?: boolean): boolean | undefined
    getBoolean(name: string, required?: boolean): boolean | undefined {
        
        return this.get(name, required)?.value as boolean;
    }

    getNumber(name: string, required: true): number
    getNumber(name: string, required?: boolean): number | undefined
    getNumber(name: string, required?: boolean): number | undefined {
        
        return this.get(name, required)?.value as number;
    }

    getInteger(name: string, required: true): number
    getInteger(name: string, required?: boolean): number | undefined
    getInteger(name: string, required?: boolean): number | undefined {
        
        return this.get(name, required)?.value as number;
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

    getRole(name: string, required: true): Role;
    getRole(name: string, required?: boolean): Role | undefined;
    getRole(name: string, required?: boolean): Role | undefined {
        const option = this.get(name, required) as RoleOption;
        return option?.role;
    }

    getMentionable(name: string, required: true): User | Role | InteractionDataResolvedGuildMember;
    getMentionable(name: string, required?: boolean): User | Role | InteractionDataResolvedGuildMember | undefined;
    getMentionable(name: string, required?: boolean): User | Role | InteractionDataResolvedGuildMember | undefined {
        const option = this.get(name, required);
        if (option instanceof UserOption) {
            return option.member ?? option.user;
        }
        else if (option instanceof RoleOption) {
            return option.role;
        }
        return undefined;
    }

    getAttachment(name: string, required: true): APIAttachment;
    getAttachment(name: string, required?: boolean): APIAttachment | undefined;
    getAttachment(name: string, required?: boolean): APIAttachment | undefined {
        const option = this.get(name, required) as AttachmentOption;
        return option?.attachment;
    }

    getChannel(name: string, required: true): InteractionDataResolvedChannel ;
    getChannel(name: string, required?: boolean): InteractionDataResolvedChannel | undefined;
    getChannel(name: string, required?: boolean): InteractionDataResolvedChannel | undefined {
        const option = this.get(name, required) as ChannelOption;
        return option?.channel;
    }

    getSubcommand(required: true): string;
    getSubcommand(required?: boolean): string | undefined;
    getSubcommand(required?: boolean): string | undefined {
        const value = this.subCommands.subCommand;
        if (required && !value) throw new Error("Missing required subcommand");
        return value;
    }

    getSubcommandGroup(required: true): string;
    getSubcommandGroup(required?: boolean): string | undefined;
    getSubcommandGroup(required?: boolean): string | undefined {
        const value = this.subCommands.subCommandGroup;
        if (required && !value) throw new Error("Missing required subcommand group");
        return value;
    }
    
}