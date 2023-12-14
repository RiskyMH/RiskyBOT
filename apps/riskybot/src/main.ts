import { Client } from "@riskybot/command";
import { parseRawInteraction } from "discord-api-parser";
import { env } from "#env.ts";
import commands from "#commands.ts";
import { APIInteraction, InteractionResponseType, InteractionType } from "discord-api-types/v10";
import { verify } from "discord-verify";
import crypto from "node:crypto";

const client = new Client();
await client.setCommands(commands);

export default async function handle(request: Request): Promise<Response> {
    if (request.method !== "POST") {
        return Response.json({ error: "Only can use POST method" }, { status: 405 });
    }

    const signature = request.headers.get("x-signature-ed25519");
    const timestamp = request.headers.get("x-signature-timestamp");
    const body = await request.text();

    if (!signature || !timestamp || !body) {
        return Response.json({ error: "Invalid headers and/or body" }, { status: 405 });
    }

    if (!await verify(body, signature, timestamp, env.RISKYBOT_APPLICATION_PUBLIC_KEY, crypto.webcrypto.subtle)) {
        return Response.json({ error: "Bad request signature" }, { status: 401 });
    }

    // VALID NOW
    const json = JSON.parse(body) as APIInteraction;
    
    // Handle PINGs from Discord
    if (json.type === InteractionType.Ping) {
        console.info("Handling Ping request");
        return Response.json({ type: InteractionResponseType.Pong });
    }

    const interaction = parseRawInteraction(json);
    await client.handleInteraction(interaction);

    return Response.json({ interaction: "sent" });

}

export { handle, client };