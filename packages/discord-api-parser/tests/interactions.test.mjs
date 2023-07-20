import { ApplicationCommandType, ChannelType, InteractionType } from "discord-api-types/v10";
import { BaseInteraction, ButtonInteraction, ChatInputInteraction, parseRawInteraction } from "../dist/interactions/interactions.mjs";
import { describe, it } from "node:test";
import assert from "node:assert";

// TODO: Add more tests

describe("Chat input interaction", async () => {

    /** @type {import("discord-api-types/v10").APIChatInputApplicationCommandInteraction} */
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
        }
    };


    it("should work with basic interaction", async () => {
        const interaction = new BaseInteraction(fakeInteraction);
        assert.ok(interaction);
    });

    it("should determine that the interaction is a chatinput command", async () => {
        const interaction = parseRawInteraction(fakeInteraction);
        assert.ok(interaction.isChatInputCommand());
        assert.ok(interaction instanceof ChatInputInteraction);
        assert.ok(!(interaction instanceof ButtonInteraction));
        assert.ok(interaction.isChatInputCommand());
    });
});