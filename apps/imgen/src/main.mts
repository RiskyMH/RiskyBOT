import { Client } from "@riskybot/command";
import { parseRawInteraction, verifyInteraction } from "discord-api-parser";
import type { Request, Response } from "express";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "#env.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const client = new Client(__dirname);
await client.getCommands();


export default async function handle(request: Request, response: Response) {
    if (!await verifyInteraction(request, response, env.IMGEN_APPLICATION_PUBLIC_KEY)) return;

    const interaction = parseRawInteraction(request.body);

    await client.handleInteraction(interaction);

    if (response.headersSent) return;
    return void response.json({ interaction: "sent" });

}

export { handle, client };

// Temporary fix for Vercel to know about these files 
// @ts-expect-error This will exist for build
export * as cmds from "./commands/index.mjs";
