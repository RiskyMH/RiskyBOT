import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { Client } from "discord.js";
import { defaultApplicationCommands as commands } from "@riskybot/functions";
import * as tools from "@riskybot/tools";

const Config = new tools.Config("./config.yml", true);
const EnvEnabled = new tools.EnvEnabled(process.env);

const client = new Client({ intents: 0 }); // doesn't need any intents - only logging in to get id

if (process.env.discordapiExtra) client.login(process.env.discordapiExtra);
else if (process.env.discordapi) client.login(process.env.discordapi);
else console.error("\u001b[31m\u001b[1mDISCORD TOKEN REQUIRED\u001b[0m\n- put a valid discord bot token in `.env`\n- and make sure you used `yarn deployCommands:extra`\n");


client.once("ready", async () => {
    
    let builders = [
        ...commands.meCredits(Config, EnvEnabled),
        ...commands.ping(Config, EnvEnabled),
        ...commands.message(Config, EnvEnabled),
        ...commands.say(Config, EnvEnabled),
    ];

    let data = builders.map(command => command.toJSON());

    const rest = new REST({ version: "9" }).setToken(client.token);
    
    // let data2 = await rest.get(Routes.applicationCommands(client.user.id));
    // let data = [...data1, ...data2];

    await rest.put(Routes.applicationCommands(client.user.id, ), { body: data });
    console.info("\x1b[92mReloaded `extra` application (/) commands.\x1b[0m");

    if (!process.env.discordapiExtra) console.warn("This is using the main discord key - if this used it could override the main's commands");

    client.destroy();
});
