import type { ComponentBuilder, EmbedBuilder, ModalBuilder } from "@discordjs/builders";
import { APIEmbed, APIButtonComponent, APISelectMenuComponent, APIInteraction, InteractionType, ApplicationCommandType, APIAllowedMentions, LocaleString, ComponentType, APIModalInteractionResponseCallbackData } from "discord-api-types/v10";
import type ApplicationCommandInteraction from "./ApplicationCommandInteraction.mjs";
import type ChatInputInteraction from "./ChatInputInteraction.mjs";
import type MessageComponentInteraction from "./MessageComponentInteraction.mjs";
import type UserCommandInteraction from "./UserCommandInteraction.mjs";
import type ButtonInteraction from "./ButtonComponentInteraction.mjs";
import type SelectMenuInteraction from "./SelectMenuComponentInteraction.mjs";
import type AutocompleteInteraction from "./AutocompleteInteraction.mjs";
import type ModalSubmitInteraction from "./ModalSubmitInteraction.mjs";
import type MessageCommandInteraction from "./MessageCommandInteraction.mjs";
import { InteractionGuildMember } from "../payloads/Member.mjs";
import User from "../payloads/User.mjs";
import { Permissions } from "../index.mjs";
import { DiscordSnowflake } from "@sapphire/snowflake";


export default class BaseInteraction {
    /** ID of the interaction */
    id: string;
    /** A continuation token for responding to the interaction */
    token: string;
    /** ID of the application this interaction is for */
    applicationId: string;
    /** The channel it was sent from */
    channelId?: string;
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
    guildLocale?: LocaleString;

    constructor(interaction: APIInteraction) {

        this.id = interaction.id;
        this.token = interaction.token;
        
        this.applicationId = interaction.application_id;
        this.applicationPermissions = new Permissions(interaction.app_permissions ?? "0");

        this.channelId = interaction.channel_id;
        this.guildId = interaction.guild_id;
        this.user = new User(interaction.user || interaction.member!.user);
        this.userId = this.user.id;
        if (interaction.member && this.guildId) this.member = new InteractionGuildMember(interaction.member, this.guildId);
        this.type = interaction.type;

        this.guildLocale = interaction.guild_locale;

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
        return this.type === InteractionType.ApplicationCommand;
    }

    /**
     * Indicates whether this interaction is a {@link ChatInputInteraction}.
     */
    isChatInputCommand(): this is ChatInputInteraction {
        return this.isApplicationCommand() && this.commandType === ApplicationCommandType.ChatInput;
    }

    /**
     * Indicates whether this interaction is a {@link UserCommandInteraction}.
     */
    isUserCommand(): this is UserCommandInteraction {
        return this.isApplicationCommand() && this.commandType === ApplicationCommandType.User;
    }

    /**
     * Indicates whether this interaction is a {@link MessageCommandInteraction}.
     */
    isMessageCommand(): this is MessageCommandInteraction {
        return this.isApplicationCommand() && this.commandType === ApplicationCommandType.Message;
    }

    /**
     * Indicates whether this interaction is a {@link MessageComponentInteraction}.
     */
    isMessageComponent() : this is MessageComponentInteraction {
        return this.type === InteractionType.MessageComponent;
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
        return this.type === InteractionType.ApplicationCommandAutocomplete;
    }

    /**
     * Indicates whether this interaction is a {@link ModalSubmitInteraction}.
     */
    isModalSubmit(): this is ModalSubmitInteraction {
        return this.type === InteractionType.ModalSubmit;
    }

    // /**
    //  * Indicates whether this interaction is a {@link PingInteraction}.
    //  */
    // isPingInteraction(): this is PingInteraction {
    //     return this.type === InteractionType.Ping;
    // }

    
}

export type InteractionResponseData = {
    /** The content of a message */
    content?: string, 
    /** The embeds of a message */
    embeds?: (APIEmbed | EmbedBuilder)[], 
    /** The components of a message */
    components?: (APIButtonComponent | APISelectMenuComponent | ComponentBuilder)[]
    /** Is the message ephemeral? */
    ephemeral?: boolean,
    /** Who can be mentioned? */
    allowed_mentions?: APIAllowedMentions
};

export type InteractionModalResponseData = APIModalInteractionResponseCallbackData | ModalBuilder;
