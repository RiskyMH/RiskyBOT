import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { Client } from "discord.js";
import { readFileSync } from "fs";

const client = new Client({ intents: 0 }); // doesn't need any intents - only logging in to get id
const client2 = new Client({ intents: 0 }); // doesn't need any intents - only logging in to get id

if (process.env.discordapi) client.login(process.env.discordapi);
else console.error("\u001b[31m\u001b[1mDISCORD TOKEN REQUIRED\u001b[0m\n- put a valid discord bot token in `.env`\n- and make sure you used `npm run deployCommands:extra`\n");


client.once("ready", async () => {

    let data = JSON.parse(readFileSync("src/applicationCommands/commandsOwnerOnly.json").toString());

    const rest = new REST({ version: "10" }).setToken(client.token);

    await rest.put(Routes.applicationGuildCommands(client.user.id, process.env.ownerGuildId), { body: data });
    console.info("\x1b[92mReloaded `owner`(and normal) application (/) commands.\x1b[0m");

    client.destroy();
});

if (process.env.discordapi2) {
    client2.login(process.env.discordapiExtra);

    client2.once("ready", async () => {

        let data = JSON.parse(readFileSync("src/applicationCommands/commandsOwnerOnly.json").toString());
        const rest = new REST({ version: "10" }).setToken(client2.token);

        await rest.put(Routes.applicationGuildCommands(client2.user.id, process.env.ownerGuildId), { body: data });
        console.info("\x1b[92mReloaded `owner extra` application (/) commands.\x1b[0m");

        client2.destroy();
    }); 
}
