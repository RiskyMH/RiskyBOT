import * as tools from "@riskybot/tools";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Routes } from "discord-api-types/v10";
import { applicationCommands } from "../imgen.mjs";
import { fetch } from "undici";

const DISCORD_API_URL = "https://discord.com/api/v10";


async function deployCommands() {
    const botToken = process.env.IMGEN_APPLICATION_TOKEN;
    const applicationId = process.env.IMGEN_APPLICATION_ID;
    const privateKey = process.env.IMGEN_APPLICATION_OAUTH_SECRET;
    let bearerToken = process.env.IMGEN_APPLICATION_BEARER_TOKEN;

    if (!botToken && !bearerToken) {
        if (!applicationId) throw new Error("APPLICATION_ID is not set");
        if (!privateKey) throw new Error("APPLICATION_OAUTH_SECRET is not set");

        bearerToken ||= await tools.getBearerTokenFromKey(applicationId, privateKey, ["applications.commands.update"]);
        if (!bearerToken) throw new Error("Failed to get bearer token");
    }

    if (!applicationId) throw new Error("APPLICATION_ID is not set");

    const data = applicationCommands;

    let authorization = "";
    if (botToken) authorization = `Bot ${botToken}`;
    else if (bearerToken) authorization = `Bearer ${bearerToken}`;

    const abc = await fetch(DISCORD_API_URL + Routes.applicationCommands(applicationId), {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": authorization,
        },
        body: JSON.stringify(data),
    });

    if (abc.status !== 200) throw new Error(`Failed to update commands: ${await abc.text()}`);

    console.info("\x1b[92mReloaded application (/) commands.\x1b[0m");

}
export default async function (request: VercelRequest, response: VercelResponse): Promise<void | VercelResponse> {

    process.env.IMGEN_APPLICATION_TOKEN = request.query.token?.toString() || process.env.IMGEN_APPLICATION_TOKEN;
    process.env.IMGEN_APPLICATION_ID = request.query.id?.toString() || process.env.IMGEN_APPLICATION_ID;
    process.env.IMGEN_APPLICATION_OAUTH_SECRET = request.query.client_secret?.toString() || process.env.IMGEN_APPLICATION_OAUTH_SECRET;
    process.env.IMGEN_APPLICATION_BEARER_TOKEN = request.query.bearer?.toString() || process.env.IMGEN_APPLICATION_BEARER_TOKEN;

    if (!process.env.IMGEN_APPLICATION_TOKEN && !process.env.IMGEN_APPLICATION_BEARER_TOKEN && !process.env.IMGEN_APPLICATION_OAUTH_SECRET) {
        response.status(400).json("Missing token");
        return;
    }

    if (!process.env.IMGEN_APPLICATION_ID) {
        response.status(400).json("Missing application id");
        return;
    }

    response.send("Deploying...");

    await deployCommands();
}

await deployCommands();

