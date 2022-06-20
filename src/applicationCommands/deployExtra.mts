import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { Client } from "discord.js";
import { defaultApplicationCommands as commands } from "@riskybot/functions";
import * as tools from "@riskybot/tools";

const config = new tools.Config("./config.yml", undefined, true);
const EnvEnabled = new tools.EnvEnabled(process.env);

const client = new Client({ intents: 0 }); // doesn't need any intents - only logging in to get id

if (process.env.DISCORD_EXTRA_TOKEN) client.login(process.env.DISCORD_EXTRA_TOKEN);
else if (process.env.DISCORD_TOKEN) client.login(process.env.DISCORD_TOKEN);
else console.error("\u001b[31m\u001b[1mDISCORD TOKEN REQUIRED\u001b[0m\n- put a valid discord bot token in `.env`\n- and make sure you used `yarn deployCommands:extra`\n");


client.once("ready", async () => {

    if (!client || !client.token || !client.user) {console.error("Not client..."); return;}

    const builders = [
        ...commands.meCredits(config, EnvEnabled),
        ...commands.ping(config, EnvEnabled),
        ...commands.message(config, EnvEnabled),
        ...commands.say(config, EnvEnabled),
    ];

    const data = builders.map(command => command.toJSON());

    const rest = new REST({ version: "9" }).setToken(client.token);
    
    await rest.put(Routes.applicationCommands(client.user.id, ), { body: data });
    console.info("\x1b[92mReloaded `extra` application (/) commands.\x1b[0m");

    if (!process.env.DISCORD_EXTRA_TOKEN) console.warn("This is using the main discord key - if this used it could override the main's commands");

    client.destroy();
});
