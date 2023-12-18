import { DiscordSnowflake } from "@sapphire/snowflake";
import { InteractionType, ApplicationCommandType, ComponentType, type InteractionStructure, type GuildInteractionStructure, type DMApplicationCommandInteractionStructure, type EmbedStructure, type MessageComponentStructure, type AllowedMentionType, type Locale, type ModalCallbackDataStructure } from "lilybird";
import { PartialChannel, Permissions } from "../index.ts";
import { InteractionGuildMember } from "../payloads/Member.ts";
import User from "../payloads/User.ts";
import type ApplicationCommandInteraction from "./ApplicationCommandInteraction.ts";
import type AutocompleteInteraction from "./AutocompleteInteraction.ts";
import type ButtonInteraction from "./ButtonComponentInteraction.ts";
import type ChatInputInteraction from "./ChatInputInteraction.ts";
import type MessageCommandInteraction from "./MessageCommandInteraction.ts";
import type MessageComponentInteraction from "./MessageComponentInteraction.ts";
import type ModalSubmitInteraction from "./ModalSubmitInteraction.ts";
import type SelectMenuInteraction from "./SelectMenuComponentInteraction.ts";
import type UserCommandInteraction from "./UserCommandInteraction.ts";
import type PingInteraction from "./PingInteraction.ts";
import type AttachmentBuilder from "../basic/AttachmentBuilder.ts";


export default class BaseInteraction {
    /** ID of the interaction */
    id: string;
    /** A continuation token for responding to the interaction */
    token: string;
    /** ID of the application this interaction is for */
    applicationId: string;
    /** The channel it was sent from */
    channel?: PartialChannel;
    /** The guild it was sent from */
    guildId?: string;
    /** Guild member data for the invoking user, including permissions */
    member?: InteractionGuildMember;
    /** User object for the invoking user */
    user: User;
    /** The user id for the invoking user */
    userId: string;
    /** The type of interaction */
    type: InteractionType;
    /** Set of permissions the app or bot has within the channel the interaction was sent from */
    applicationPermissions?: Permissions;
    /** The guild's preferred locale */
    guildLocale?: Locale;

    constructor(interaction: InteractionStructure) {
        const interactionn = interaction as InteractionStructure & Partial<GuildInteractionStructure> & Partial<DMApplicationCommandInteractionStructure>;

        this.id = interaction.id;
        this.token = interaction.token;

        this.applicationId = interaction.application_id;
        this.applicationPermissions = new Permissions(interactionn.app_permissions ?? "0");

        // @ts-expect-error - some type issues
        this.channel = new PartialChannel(interactionn.channel!);
        this.guildId = interactionn.guild_id;
        this.user = new User((interactionn.user || interactionn.member!.user)!);
        this.userId = this.user.id;
        if (interactionn.member && this.guildId) this.member = new InteractionGuildMember(interactionn.member, this.guildId);
        this.type = interaction.type;

        this.guildLocale = interactionn.guild_locale;

    }

    /** The webhook url for this interaction */
    get webhookUrl(): string {
        return `https://discord.com/api/v10/webhooks/${this.applicationId}/${this.token}`;
    }

    /** The time the interaction was made */
    get createdAt(): Date {
        return new Date(DiscordSnowflake.timestampFrom(this.id));
    }

    /**
     * Indicates whether this interaction is a {@link ApplicationCommandInteraction}.
     */
    isApplicationCommand(): this is ApplicationCommandInteraction {
        return this.type === InteractionType.APPLICATION_COMMAND;
    }

    /**
     * Indicates whether this interaction is a {@link ChatInputInteraction}.
     */
    isChatInputCommand(): this is ChatInputInteraction {
        return this.isApplicationCommand() && this.commandType === ApplicationCommandType.CHAT_INPUT;
    }

    /**
     * Indicates whether this interaction is a {@link UserCommandInteraction}.
     */
    isUserCommand(): this is UserCommandInteraction {
        return this.isApplicationCommand() && this.commandType === ApplicationCommandType.USER;
    }

    /**
     * Indicates whether this interaction is a {@link MessageCommandInteraction}.
     */
    isMessageCommand(): this is MessageCommandInteraction {
        return this.isApplicationCommand() && this.commandType === ApplicationCommandType.MESSAGE;
    }

    /**
     * Indicates whether this interaction is a {@link MessageComponentInteraction}.
     */
    isMessageComponent(): this is MessageComponentInteraction {
        return this.type === InteractionType.MESSAGE_COMPONENT;
    }

    /**
     * Indicates whether this interaction is a {@link ButtonInteraction}.
     */
    isButton(): this is ButtonInteraction {
        return this.isMessageComponent() && this.componentType === ComponentType.Button;
    }

    /**
     * Indicates whether this interaction is a {@link SelectMenuInteraction}.
     */
    isSelectMenu(): this is SelectMenuInteraction {
        return this.isMessageComponent() && [
            ComponentType.StringSelect,
            ComponentType.UserSelect,
            ComponentType.RoleSelect,
            ComponentType.MentionableSelect,
            ComponentType.ChannelSelect,
        ].includes(this.componentType);
    }

    /**
     * Indicates whether this interaction is a {@link AutocompleteInteraction}.
     */
    isAutocomplete(): this is AutocompleteInteraction {
        return this.type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE;
    }

    /**
     * Indicates whether this interaction is a {@link ModalSubmitInteraction}.
     */
    isModalSubmit(): this is ModalSubmitInteraction {
        return this.type === InteractionType.MODAL_SUBMIT;
    }

    /**
     * Indicates whether this interaction is a {@link PingInteraction}.
     */
    isPingInteraction(): this is PingInteraction {
        return this.type === InteractionType.PING;
    }

}

export type InteractionResponseData = {
    /** The content of a message */
    content?: string,
    /** The embeds of a message */
    embeds?: (EmbedStructure)[],
    /** The components of a message */
    components?: MessageComponentStructure[]
    /** Is the message ephemeral? */
    ephemeral?: boolean,
    /** Who can be mentioned? */
    allowed_mentions?: AllowedMentionType,
    /** The attachments to send */
    attachments?: AttachmentBuilder[]
};

export type InteractionModalResponseData = ModalCallbackDataStructure;
