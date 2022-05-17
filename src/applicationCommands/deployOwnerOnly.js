import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { Client } from "discord.js";
import { defaultApplicationCommands as commands } from "@riskybot/functions";
import * as tools from "@riskybot/tools";

const Config = new tools.Config("./config.yml", true);
const EnvEnabled = new tools.EnvEnabled(process.env);

const client = new Client({ intents: 0 }); // doesn't need any intents - only logging in to get id

if (process.env.discordapi) client.login(process.env.discordapi);
else console.error("\u001b[31m\u001b[1mDISCORD TOKEN REQUIRED\u001b[0m\n- put a valid discord bot token in `.env`\n- and make sure you used `yarn deployCommands:ownerOnly`\n");

// ADDS it ontop of the existing commands
client.once("ready", async () => {

    let builders = [
        ...commands.ownerCmds(Config, EnvEnabled),
    ];
    let data = builders.map(command => command.toJSON());
    const rest = new REST({ version: "10" }).setToken(client.token);

    for (let d of data) await rest.post(Routes.applicationGuildCommands(client.user.id, process.env.ownerGuildId), { body: d });
    console.info("\x1b[92mReloaded `owner` application (/) commands.\x1b[0m");

    client.destroy();
});



// if (process.env.discordapi2) {
//     client2.login(process.env.discordapiExtra);

//     client2.once("ready", async () => {

//         let data = JSON.parse(readFileSync("src/applicationCommands/commandsOwnerOnly.json").toString());
//         const rest = new REST({ version: "10" }).setToken(client2.token);

//         await rest.put(Routes.applicationGuildCommands(client2.user.id, process.env.ownerGuildId), { body: data });
//         console.info("\x1b[92mReloaded `owner extra` application (/) commands.\x1b[0m");

//         client2.destroy();
//     }); 
// }
