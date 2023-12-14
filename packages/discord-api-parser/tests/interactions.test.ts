import { APIChatInputApplicationCommandInteraction, APIInteraction, ApplicationCommandType, ChannelType, InteractionType } from "discord-api-types/v10";
import { BaseInteraction, ButtonInteraction, ChatInputInteraction, parseRawInteraction } from "discord-api-parser";
import { describe, expect, it } from "bun:test";


describe("Chat input interaction", async () => {

    const fakeInteraction = {
        id: "id",
        channel_id: "channel_id",
        application_id: "app_id",
        type: InteractionType.ApplicationCommand,
        locale: "en-US",
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
            type: ChannelType.GuildText
        },
        version: 1,
        data: {
            id: "id",
            name: "name",
            type: ApplicationCommandType.ChatInput,
        },
        entitlements: []
    } satisfies APIChatInputApplicationCommandInteraction;


    it("should work with basic interaction", async () => {
        const interaction = new BaseInteraction(fakeInteraction as APIInteraction);
        expect(interaction).toBeTruthy();
    });

    it("should determine that the interaction is a chatinput command", async () => {
        const interaction = parseRawInteraction(fakeInteraction);
        expect(interaction.isChatInputCommand()).toBeTrue();
        expect(interaction).toBeInstanceOf(ChatInputInteraction);
        expect(interaction).not.toBeInstanceOf(ButtonInteraction);
        // @ts-expect-error this is ensured above
        expect(interaction.commandType).toBe(ApplicationCommandType.ChatInput);
    });
});
