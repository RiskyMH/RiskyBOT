import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { Client } from "discord.js";
import { defaultApplicationCommands as commands } from "@riskybot/functions";
import * as tools from "@riskybot/tools";

const config = new tools.Config("./config.yml", undefined, true);
const EnvEnabled = new tools.EnvEnabled(process.env);

const client = new Client({ intents: 0 }); // doesn't need any intents - only logging in to get id

if (process.env.DISCORD_TOKEN) client.login(process.env.DISCORD_TOKEN);
else console.error("\u001b[31m\u001b[1mDISCORD TOKEN REQUIRED\u001b[0m\n- put a valid discord bot token in `.env`\n- and make sure you used `yarn deployCommands:ownerOnly`\n");
if (!process.env.OWNER_GUILD_ID) console.error("\u001b[31m\u001b[1mOWNER GUILD ID REQUIRED\u001b[0m\n- put a valid discord guild id in `.env`");

// ADDS it ontop of the existing commands
client.once("ready", async () => {
    
    if (!client || !client.token || !client.user || !process.env.OWNER_GUILD_ID) {console.error("Not client..."); return;}
    

    const builders = [
        ...commands.ownerCmds(config, EnvEnabled),
    ];
    const data = builders.map(command => command.toJSON());
    const rest = new REST({ version: "10" }).setToken(client.token);

    // Make it not override the existing commands, but add new ones or replace existing ones (with same name)
    for (const d of data) await rest.post(Routes.applicationGuildCommands(client.user.id, process.env.OWNER_GUILD_ID), { body: d });
    console.info("\x1b[92mReloaded `owner` application (/) commands.\x1b[0m");

    client.destroy();
});



// if (process.env.DISCORD_TOKEN2) {
//     client2.login(process.env.DISCORD_EXTRA_TOKEN);

//     client2.once("ready", async () => {

//         let data = JSON.parse(readFileSync("src/applicationCommands/commandsOwnerOnly.json").toString());
//         const rest = new REST({ version: "10" }).setToken(client2.token);

//         await rest.put(Routes.applicationGuildCommands(client2.user.id, process.env.OWNER_GUILD_ID), { body: data });
//         console.info("\x1b[92mReloaded `owner extra` application (/) commands.\x1b[0m");

//         client2.destroy();
//     }); 
// }
