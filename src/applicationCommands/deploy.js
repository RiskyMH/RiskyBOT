import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { Client } from "discord.js";
import { readFileSync } from "fs";
import {defaultApplicationCommands as commands} from "@riskybot/functions";
import * as tools from "@riskybot/tools";

const Config = new tools.Config("./config.yml", true);
const EnvEnabled = new tools.EnvEnabled(process.env);

const client = new Client({ intents: 0 }); // doesn't need any intents - only logging in to get id

if (process.env.discordapi) client.login(process.env.discordapi);
else console.error("\u001b[31m\u001b[1mDISCORD TOKEN REQUIRED\u001b[0m\n- put a valid discord bot token in `.env`\n- and make sure you used `npm run deployCommands`\n");


//TODO: add all the commands from `@riskybot/functions` (req making them)


client.once("ready", async () => {

    // let data = JSON.parse(readFileSync("src/applicationCommands/commands.json").toString());
    let builders = [...commands.search(Config, EnvEnabled), ...commands.say(Config, EnvEnabled)];
    let data = builders.map(command => command.toJSON());
    console.log(data, EnvEnabled);
    const rest = new REST({ version: "10" }).setToken(client.token);

    await rest.put(Routes.applicationCommands(client.user.id,), { body: data });
    console.info("\x1b[92mReloaded application (/) commands.\x1b[0m");

    client.destroy();
});

