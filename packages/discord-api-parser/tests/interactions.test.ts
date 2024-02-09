import { BaseInteraction, ButtonInteraction, ChatInputInteraction, parseRawInteraction } from "discord-api-parser";
import { describe, expect, it } from "bun:test";
import { ApplicationCommandType, ChannelType, InteractionType, Locale, type ApplicationCommandInteractionStructure, type InteractionStructure } from "lilybird";


describe("Chat input interaction", async () => {

    const fakeInteraction = {
        id: "id",
        channel_id: "channel_id",
        application_id: "app_id",
        type: InteractionType.APPLICATION_COMMAND,
        locale: Locale.EnglishUS,
        token: "token",
        app_permissions: "0",
        user: {
            id: "user_id",
            username: "username",
            discriminator: "discriminator",
            avatar: "avatar",
            global_name: "global_name",
        },
        channel: {
            id: "channel_id",
            name: "channel_name",
            type: ChannelType.GUILD_TEXT
        },
        version: 1,
        data: {
            id: "id",
            name: "name",
            type: ApplicationCommandType.CHAT_INPUT,
        },
        entitlements: []
    } satisfies ApplicationCommandInteractionStructure;


    it("should work with basic interaction", async () => {
        const interaction = new BaseInteraction(fakeInteraction as InteractionStructure);
        expect(interaction).toBeTruthy();
    });

    it("should determine that the interaction is a chatinput command", async () => {
        const interaction = parseRawInteraction(fakeInteraction);
        expect(interaction.isChatInputCommand()).toBeTrue();
        expect(interaction).toBeInstanceOf(ChatInputInteraction);
        expect(interaction).not.toBeInstanceOf(ButtonInteraction);
        // @ts-expect-error this is ensured above
        expect(interaction.commandType).toBe(ApplicationCommandType.CHAT_INPUT);
    });
});
