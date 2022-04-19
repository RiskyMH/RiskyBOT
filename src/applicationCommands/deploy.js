import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { Client } from "discord.js";
import { readFileSync } from "fs";

const client = new Client({ intents: 0 }); // doesn't need any intents - only logging in to get id

// /** @type {import("../types").ConfigJSON} */
// const config = JSON.parse(readFileSync("./config.json").toString());

if (process.env.discordapi) client.login(process.env.discordapi);
else console.error("\u001b[31m\u001b[1mDISCORD TOKEN REQUIRED\u001b[0m\n- put a valid discord bot token in `.env`\n- and make sure you used `npm run deployCommands`\n");

client.once("ready", async () => {

    let data = JSON.parse(readFileSync("src/applicationCommands/commands.json").toString());
    const rest = new REST({ version: "9" }).setToken(client.token);

    await rest.put(Routes.applicationCommands(client.user.id,), { body: data });
    console.info("\x1b[92mReloaded application (/) commands.\x1b[0m");

    client.destroy();
});

