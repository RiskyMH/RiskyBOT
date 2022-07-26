import { Routes } from "discord-api-types/v10";
import {defaultApplicationCommands as commands} from "@riskybot/commands";
import * as tools from "@riskybot/tools";
import { fetch } from "undici";

const config = new tools.Config("./config.yml", undefined, true);
const EnvEnabled = new tools.EnvEnabled(process.env);
const DISCORD_API_URL = "https://discord.com/api/v10";

// if (!process.env.APPLICATION_TOKEN) {
//     console.error("\u001b[31m\u001b[1mDISCORD TOKEN REQUIRED\u001b[0m\n- put a valid discord bot token in `.env`\n- and make sure you used `yarn deployCommands`\n");
//     exit(1);
// }
// if (!process.env.OWNER_GUILD_ID) {
//     console.error("\u001b[31m\u001b[1mOWNER GUILD ID REQUIRED\u001b[0m\n- put a valid discord guild id in `.env`");
//     exit(1);
// }


async function deployGuildCommands() {
    const botToken = process.env.APPLICATION_TOKEN;
    const applicationId = process.env.APPLICATION_ID;
    const privateKey = process.env.APPLICATION_PRIVATE_KEY;
    const bearerToken = process.env.APPLICATION_BEARER_TOKEN;
    const guildId = process.env.OWNER_GUILD_ID || "";

    if (!botToken && !bearerToken) {
        if (!applicationId) throw new Error("APPLICATION_ID is not set");
        if (!privateKey) throw new Error("APPLICATION_PRIVATE_KEY is not set");
        
        tools.getBearerTokenFromKey(applicationId, privateKey, ["applications.commands.update"]);
    }

    if (!guildId) throw new Error("OWNER_GUILD_ID is not set");

    if (!applicationId) throw new Error("APPLICATION_ID is not set");

    const builders = [
        ...commands.ownerCmds(config, EnvEnabled),
    ];
    const data = builders.map(command => command.toJSON());
    
    let authorization = "";
    if (botToken) authorization = `Bot ${botToken}`;
    else if (bearerToken) authorization = `Bearer ${bearerToken}`;

    const abc = await fetch(DISCORD_API_URL + Routes.applicationGuildCommands(applicationId, guildId), {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "Authorization": authorization,
        },
        body: JSON.stringify(data),
    });

    if (abc.status !== 200) throw new Error(`Failed to update owner commands: ${await abc.text()}`);

    console.info("\x1b[92mReloaded `owner` application (/) commands.\x1b[0m");

}

await deployGuildCommands();
