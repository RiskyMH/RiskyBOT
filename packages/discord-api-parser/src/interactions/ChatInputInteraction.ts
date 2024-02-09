import { ApplicationCommandOptionType, type ApplicationCommandType, type ApplicationCommandInteractionStructure, type AttachmentStructure, type ApplicationCommandInteractionDataOptionStructure, type ResolvedDataStructure } from "lilybird";
import { InteractionDataResolvedChannel } from "../channels/PartialChannel.ts";
import { InteractionDataResolvedGuildMember } from "../payloads/Member.ts";
import Role from "../payloads/Role.ts";
import User from "../payloads/User.ts";
import ApplicationCommandInteraction from "./ApplicationCommandInteraction.ts";
import type { MessageOption } from "./MessageCommandInteraction.ts";


export default class ChatInputInteraction extends ApplicationCommandInteraction {
    declare commandType: ApplicationCommandType.CHAT_INPUT;
    /** The options that the invoking user has provided for the command */
    options: ChatInputInteractionOption;

    constructor(interaction: ApplicationCommandInteractionStructure) {
        super(interaction);

        this.options = new ChatInputInteractionOption(interaction.data.options, interaction.data.resolved, this.guildId);

    }

}

export type Options = StringOption | NumberOption | UserOption | RoleOption | BooleanOption | IntegerOption | ChannelOption | AttachmentOption | MentionableOption | MessageOption;

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
    declare type: ApplicationCommandOptionType.STRING;
    declare value: string;

    constructor(name: string, value: string) {
        super(ApplicationCommandOptionType.STRING, name, value);
    }
}

export class NumberOption extends BaseOption {
    declare type: ApplicationCommandOptionType.NUMBER;
    declare value: number;

    constructor(name: string, value: number) {
        super(ApplicationCommandOptionType.NUMBER, name, value);
    }
}

export class IntegerOption extends BaseOption {
    declare type: ApplicationCommandOptionType.NUMBER;
    declare value: number;

    constructor(name: string, value: number) {
        super(ApplicationCommandOptionType.NUMBER, name, value);
    }

}

export class BooleanOption extends BaseOption {
    declare type: ApplicationCommandOptionType.BOOLEAN;
    declare value: boolean;

    constructor(name: string, value: boolean) {
        super(ApplicationCommandOptionType.BOOLEAN, name, value);
    }
}

export class UserOption extends BaseOption {
    declare type: ApplicationCommandOptionType.USER;
    declare value: string;
    user: User;
    member?: InteractionDataResolvedGuildMember;

    constructor(name: string, id: string, user: User, member?: InteractionDataResolvedGuildMember) {
        super(ApplicationCommandOptionType.USER, name, id);
        this.user = user;
        this.member = member;
    }
}

export class RoleOption extends BaseOption {
    declare type: ApplicationCommandOptionType.ROLE;
    declare value: string;
    role: Role;

    constructor(name: string, id: string, role: Role) {
        super(ApplicationCommandOptionType.ROLE, name, id);
        this.role = role;
    }
}

export type MentionableOption = UserOption | RoleOption;

export class ChannelOption extends BaseOption {
    declare type: ApplicationCommandOptionType.CHANNEL;
    declare value: string;
    channel: InteractionDataResolvedChannel;

    constructor(name: string, id: string, channel: InteractionDataResolvedChannel) {
        super(ApplicationCommandOptionType.CHANNEL, name, id);
        this.channel = channel;
    }
}

export class AttachmentOption extends BaseOption {
    declare type: ApplicationCommandOptionType.ATTACHMENT;
    declare value: string;
    attachment: AttachmentStructure;

    constructor(name: string, id: string, attachment: AttachmentStructure) {
        super(ApplicationCommandOptionType.ATTACHMENT, name, id);
        this.attachment = attachment;
    }
}


export function formatOption(option: ApplicationCommandInteractionDataOptionStructure, resolved?: ResolvedDataStructure, guildId?: string): Options {

    if (option.type === ApplicationCommandOptionType.STRING) {
        return new StringOption(option.name, option.value as string);
    }

    if (option.type === ApplicationCommandOptionType.NUMBER) {
        return new NumberOption(option.name, option.value as number);
    }

    if (option.type === ApplicationCommandOptionType.INTEGER) {
        return new IntegerOption(option.name, option.value as number);
    }

    if (option.type === ApplicationCommandOptionType.BOOLEAN) {
        return new BooleanOption(option.name, option.value as boolean);
    }

    if (option.type === ApplicationCommandOptionType.USER) {
        const user = resolved?.users?.[option.value as string];
        const member = resolved?.members?.[option.value as string];

        if (user) {
            const resolvedUser = new User(user);
            const resolvedMember = member && guildId ? new InteractionDataResolvedGuildMember(member, guildId, user.id) : undefined;
            return new UserOption(option.name, option.value as string, resolvedUser, resolvedMember);
        }
    }

    if (option.type === ApplicationCommandOptionType.ROLE) {
        const role = resolved?.roles?.[option.value as string];

        if (role) {
            const resolvedRole = new Role(role);
            return new RoleOption(option.name, option.value as string, resolvedRole);
        }
    }

    if (option.type === ApplicationCommandOptionType.CHANNEL) {
        const channel = resolved?.channels?.[option.value as string];

        if (channel) {
            const resolvedChannel = new InteractionDataResolvedChannel(channel);
            return new ChannelOption(option.name, option.value as string, resolvedChannel);
        }
    }

    if (option.type === ApplicationCommandOptionType.ATTACHMENT) {
        const attachment = resolved?.attachments?.[option.value as string];

        if (attachment) {
            const resolvedAttachment = attachment;
            return new AttachmentOption(option.name, option.value as string, resolvedAttachment);
        }
    }

    if (option.type === ApplicationCommandOptionType.MENTIONABLE) {
        const role = resolved?.roles?.[option.value as string];
        const user = resolved?.users?.[option.value as string];
        const member = resolved?.members?.[option.value as string];

        if (role) {
            const resolvedRole = new Role(role);
            return new RoleOption(option.name, option.value as string, resolvedRole);
        }
        else if (user) {
            const resolvedUser = new User(user);
            const resolvedMember = member && guildId ? new InteractionDataResolvedGuildMember(member, guildId, user.id) : undefined;
            return new UserOption(option.name, option.value as string, resolvedUser, resolvedMember);
        }

    }

    return new StringOption(option.name, "Unknown");

}


export class ChatInputInteractionOption {
    readonly options: Record<string, Options> = {};
    readonly subCommands: { subCommand?: string, subCommandGroup?: string } = {};

    constructor(options?: ApplicationCommandInteractionDataOptionStructure[], resolved?: ResolvedDataStructure, guildId?: string) {

        for (const option of options || []) {

            if (ApplicationCommandOptionType.SUB_COMMAND !== option.type && ApplicationCommandOptionType.SUB_COMMAND_GROUP !== option.type) {
                this.options[option.name] = formatOption(option, resolved, guildId);
            }

            else if (option.type === ApplicationCommandOptionType.SUB_COMMAND) {
                this.subCommands.subCommand = option.name;
                for (const subOption of option.options || []) {
                    this.options[subOption.name] = formatOption(subOption, resolved, guildId);
                }
            }

            else if (option.type === ApplicationCommandOptionType.SUB_COMMAND_GROUP) {
                this.subCommands.subCommandGroup = option.name;
                for (const subOption of option.options || []) {
                    this.subCommands.subCommand = subOption.name;
                    for (const subSubOption of subOption.options || []) {
                        this.options[subSubOption.name] = formatOption(subSubOption, resolved, guildId);
                    }
                }
            }
        }
    }


    get(name: string, required: true): Options;
    get(name: string, required?: boolean): Options | undefined;
    get(name: string, required?: boolean): Options | undefined {
        const option = this.options[name];

        if (required && !option) {
            throw new Error(`Option ${name} is required`);
        }

        return option;
    }

    getString(name: string, required: true): string;
    getString(name: string, required?: boolean): string | undefined;
    getString(name: string, required?: boolean): string | undefined {
        return this.get(name, required)?.value as string;
    }

    getBoolean(name: string, required: true): boolean;
    getBoolean(name: string, required?: boolean): boolean | undefined;
    getBoolean(name: string, required?: boolean): boolean | undefined {
        return this.get(name, required)?.value as boolean;
    }

    getNumber(name: string, required: true): number;
    getNumber(name: string, required?: boolean): number | undefined;
    getNumber(name: string, required?: boolean): number | undefined {
        return this.get(name, required)?.value as number;
    }

    getInteger(name: string, required: true): number;
    getInteger(name: string, required?: boolean): number | undefined;
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

    getAttachment(name: string, required: true): AttachmentStructure;
    getAttachment(name: string, required?: boolean): AttachmentStructure | undefined;
    getAttachment(name: string, required?: boolean): AttachmentStructure | undefined {
        const option = this.get(name, required) as AttachmentOption;
        return option?.attachment;
    }

    getChannel(name: string, required: true): InteractionDataResolvedChannel;
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
