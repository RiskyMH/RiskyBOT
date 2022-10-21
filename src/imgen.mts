import { InteractionResponseFlags } from "discord-interactions";
import { verify, PlatformAlgorithm } from "discord-verify";
import FormData from "form-data";
import { InteractionType, InteractionResponseType, ApplicationCommandType, ApplicationCommandOptionType } from "discord-api-types/v10";
import type { APIInteraction, APIApplicationCommandInteraction, APIChatInputApplicationCommandInteraction, APIInteractionResponseChannelMessageWithSource } from "discord-api-types/v10";
import crypto from "node:crypto";
// import { affect, cry } from "@riskybot/image-generate";
import { fetch } from "undici";
import type { VercelRequest, VercelResponse } from "@vercel/node";


export default async function (request: VercelRequest, response: VercelResponse): Promise<void | VercelResponse> {

    if (!process.env.IMGEN_APPLICATION_PUBLIC_KEY) throw new Error("`IMGEN_APPLICATION_PUBLIC_KEY` is not set, it is required for using Discord interactions");

    // CHECK IF VALID REQUEST
    if (request.method !== "POST") return response.status(405).json({ error: "Only can use POST method" });
    const signature = request.headers["x-signature-ed25519"]?.toString();
    const timestamp = request.headers["x-signature-timestamp"]?.toString();
    const rawBody = JSON.stringify(request.body);
    if (!signature || !timestamp || !rawBody ) return response.status(405).json({ error: "Invalid headers and/or body" });
    let isValidRequest = false;
        try {
        if (process.env.VERCEL === "1") isValidRequest = await verify(rawBody, signature, timestamp, process.env.IMGEN_APPLICATION_PUBLIC_KEY, crypto.webcrypto.subtle, PlatformAlgorithm.VercelProd);
        else isValidRequest = await verify(rawBody, signature, timestamp, process.env.IMGEN_APPLICATION_PUBLIC_KEY, crypto.webcrypto.subtle);
    } catch  {
        isValidRequest = await verify(rawBody, signature, timestamp, process.env.IMGEN_APPLICATION_PUBLIC_KEY, crypto.webcrypto.subtle, PlatformAlgorithm.OldNode);
        console.warn("Fallback to discord-verify (old node)");
    }

    if (!isValidRequest) return response.status(401).json({ error: "Bad request signature" });
    
    const interaction: APIInteraction = request.body;
    
    // console.log(JSON.stringify(interaction, null, 2));


    // Handle PINGs from Discord

    if (interaction.type === InteractionType.Ping) {
        console.info("Handling Ping request");
        return response.json({ type: InteractionResponseType.Pong });
    }

    const interactionUrl = `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}`;

    // If it is a command, not a button
    if (interaction.type === InteractionType.ApplicationCommand) {
        const interaction: APIApplicationCommandInteraction = request.body;
        // If it is a text input (slash command)

        if (interaction.data.type === ApplicationCommandType.ChatInput) {
            const interaction: APIChatInputApplicationCommandInteraction = request.body;
            console.info("ChatInput command: " + interaction.data.name);

            switch (interaction.data.name) {
                case "ping":
                    return response.send({
                        type: InteractionResponseType.ChannelMessageWithSource,
                        data: {
                            content: `Pong \`${new Date().getMilliseconds() - convertSnowflakeToDate(interaction.id).getMilliseconds()}ms\``,
                            // content: `Pong \`${new Date().getMilliseconds() - new Date(timestamp).getMilliseconds()}ms\``,
                            flags: InteractionResponseFlags.EPHEMERAL,
                        },
                    });

                case "affect": {
                    // @ts-expect-error`.value` exits. but the types are messed up
                    const userSelectedImg: string = interaction.data?.options?.find(name => name.name === "img")?.value ?? "";
                    const { affect } = await import("@riskybot/image-generate");
                    const data = await affect({ imgLink: userSelectedImg.toString() });
                    return sendAttachment(response, interactionUrl, { data, name: "affect.png", description: `True story of <@${interaction.user?.id ?? interaction.member?.user?.id}>` });
                }

                case "cry": {
                    // @ts-expect-error `.value` exits. but the types are messed up
                    const userSelectedString: string = interaction.data?.options?.find(name => name.name === "reason")?.value ?? "";
                    const { cry } = await import("@riskybot/image-generate");
                    const data = await cry({ text: userSelectedString.toString() });
                    return sendAttachment(response, interactionUrl, { data, name: "cry.png", description: `Don't cry <@${interaction.user?.id ?? interaction.member?.user?.id}>` });
                }

                case "image-from": {

                    let content = "";

                    if (interaction.data.options?.[0].type === ApplicationCommandOptionType.Subcommand && interaction.data.options?.[0].name === "user") {
                        // @ts-expect-error `.value` exits. but the types are messed up
                        const userIdSelected: string = interaction.data?.options?.[0].options?.find(name => name.name === "user")?.value ?? "";
                        const userSelected = interaction.data.resolved?.users?.[userIdSelected];
                        const memberSelected = interaction.data.resolved?.members?.[userIdSelected];

                        content = `Default avatar URL: <https://cdn.discordapp.com/embed/avatars/${Number(userSelected?.discriminator) % 5}.png>`;
                        if (userSelected?.avatar) content += `\nAvatar URL: <https://cdn.discordapp.com/avatars/${userSelected.id}/${userSelected.avatar}?size=1024>`;
                        if (memberSelected?.avatar) content += `\nServer Avatar URL: <https://cdn.discordapp.com/guilds/${interaction.guild_id}/users/${userSelected?.id}/avatars/${memberSelected.avatar}?size=1024>`;
                        if (userSelected?.banner) content += `\nBanner URL: <https://cdn.discordapp.com/banners/${userSelected.id}/${userSelected.banner}?size=1024>`;
                    }
                    
                    else if (interaction.data.options?.[0].type === ApplicationCommandOptionType.Subcommand && interaction.data.options?.[0].name === "attachment") {
                        // @ts-expect-error `.value` exits. but the types are messed up
                        const attachmentIdSelected: string = interaction.data?.options?.[0].options?.find(name => name.name === "attachment")?.value ?? "";
                        const attachmentSelected = interaction.data.resolved?.attachments?.[attachmentIdSelected];
                        content = `Attachment URL: <${attachmentSelected?.url}>`;
                    }

                    return response.send({
                        type: InteractionResponseType.ChannelMessageWithSource,
                        data: { content },
                    });
                }

                default:
                    return response.send({
                        type: InteractionResponseType.ChannelMessageWithSource,
                        data: {
                            content: `Unknown command: \`${interaction.data.name}\``,
                            flags: InteractionResponseFlags.EPHEMERAL,
                        },
                    });

            }
        }
    }
}


const DISCORD_EPOCH = 1420070400000;

function convertSnowflakeToDate(snowflake: string): Date {
    return new Date(Number(snowflake) / 4194304 + DISCORD_EPOCH);
}

async function sendAttachment(response: VercelResponse, interactionUrl: string, attachment: { data: Buffer | { error?: string }, name: string, description?: string }) {
    const form = new FormData();
    if (attachment.data instanceof Buffer) {

        const respJson: APIInteractionResponseChannelMessageWithSource = {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                allowed_mentions: {parse: []},
                content: attachment.description,
                attachments: [
                    {
                        id: "0",
                        filename: attachment.name,
                    }
                ],
                // flags: InteractionResponseFlags.EPHEMERAL,
            },
        };
        form.append("payload_json", JSON.stringify(respJson), { contentType: "application/json" });
        form.append("files[0]", attachment.data, { filename: attachment.name });
        const res = await fetch(interactionUrl+"/callback", { body: form.getBuffer(), headers: form.getHeaders(), method: "POST" });
        
        if (!res.ok) {
            console.error(await res.text());
            return response.status(500).json({ error: "Something went wrong" });
        }

        return response.status(200).end();

    } else if (attachment.data.error) {
        const respJson = {
            type: InteractionResponseType.ChannelMessageWithSource,
            flags: InteractionResponseFlags.EPHEMERAL,
            data: {
                content: "We had an issue: `" + attachment.data.error + "`",
            },
        };

        return response.send(respJson);
    } else {
        return response.status(500).json({ error: "Unknown error" });
    }

}

/** https://discord.com/api/v10/applications/${Id}applicationId/commands */
export const applicationCommands = [
    {
        "name": "ping",
        "description": "Why are you trying to ping me?"
    },
    {
        "name": "affect",
        "description": "Show everyone why you are affected",
        "options": [
            {
                "type": 3,
                "name": "img",
                "description": "The link to an image describing you",
                "required": true
            }
        ]
    },
    {
        "name": "cry",
        "description": "Show everyone why you are crying",
        "options": [
            {
                "type": 3,
                "name": "reason",
                "description": "The reason that you are crying",
                "required": true
            }
        ]
    },
    {
        name: "image-from",
        description: "Get an image",
        options: [
            {
                type: 1,
                name: "user",
                description: "The user's avatar to get an image url from",
                options: [
                    {
                        type: 6,
                        name: "user",
                        description: "The user to get an image from",
                        required: true
                    }
                ]
            },
            {
                type: 1,
                name: "attachment",
                description: "The get an image url from an attachment",
                options: [
                    {
                        type: 11,
                        name: "attachment",
                        description: "The attachment to get an image from",
                        required: true
                    }
                ]
            }
        ]

    }
];