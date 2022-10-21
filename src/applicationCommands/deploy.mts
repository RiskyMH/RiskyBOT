import { Routes } from "discord-api-types/v10";
import {defaultApplicationCommands as commands} from "@riskybot/commands";
import * as tools from "@riskybot/tools";
import { fetch } from "undici";

const config = new tools.Config("./config.yml", true);
const EnvEnabled = new tools.EnvEnabled(process.env);
const DISCORD_API_URL = "https://discord.com/api/v10";

// if (!process.env.APPLICATION_TOKEN) console.error("\u001b[31m\u001b[1mDISCORD TOKEN REQUIRED\u001b[0m\n- put a valid discord bot token in `.env`\n- and make sure you used `yarn deployCommands`\n");

async function deployCommands() {
    const botToken = process.env.APPLICATION_TOKEN;
    const applicationId = process.env.APPLICATION_ID;
    const privateKey = process.env.APPLICATION_OAUTH_SECRET;
    const bearerToken = process.env.APPLICATION_BEARER_TOKEN;

    if (!botToken && !bearerToken) {
        if (!applicationId) throw new Error("APPLICATION_ID is not set");
        if (!privateKey) throw new Error("APPLICATION_OAUTH_SECRET is not set");
        
        tools.getBearerTokenFromKey(applicationId, privateKey, ["applications.commands.update"]);
    }

    if (!applicationId) throw new Error("APPLICATION_ID is not set");

    const builders = [
        ...commands.about(config, EnvEnabled),
        ...commands.fun(config, EnvEnabled),
        ...commands.meCredits(config, EnvEnabled),
        ...commands.random(config, EnvEnabled),
        ...commands.reddit(config, EnvEnabled),
        ...commands.search(config, EnvEnabled),
        ...commands.toolsCmd(config, EnvEnabled),
        ...commands.translate(config, EnvEnabled),
        ...commands.ping(config, EnvEnabled),
    ];
    const data = builders.map((command) => command.toJSON());

    // Save commands to file using fs
    writeFileSync("./commands.json", JSON.stringify(data, null, 2));
    
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



import type { VercelRequest, VercelResponse } from "@vercel/node";
import { writeFileSync } from "node:fs";
// import "dotenv/config";

export default async function (request: VercelRequest, response: VercelResponse): Promise<void | VercelResponse> {

    process.env.APPLICATION_TOKEN = request.query.token?.toString() || process.env.APPLICATION_TOKEN;
    process.env.APPLICATION_ID = request.query.id?.toString() || process.env.APPLICATION_ID;
    process.env.APPLICATION_OAUTH_SECRET = request.query.client_secret?.toString() || process.env.APPLICATION_OAUTH_SECRET;
    process.env.APPLICATION_BEARER_TOKEN = request.query.bearer?.toString() || process.env.APPLICATION_BEARER_TOKEN;

    if (!process.env.APPLICATION_TOKEN && !process.env.APPLICATION_BEARER_TOKEN && !process.env.APPLICATION_OAUTH_SECRET) {
        response.status(400).json("Missing token");
        return;
    }

    if (!process.env.APPLICATION_ID) {
        response.status(400).json("Missing application id");
        return;
    }

    response.send("Deploying...");
    
    await deployCommands();
}

await deployCommands();

