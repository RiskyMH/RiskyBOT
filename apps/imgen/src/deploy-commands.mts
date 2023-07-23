import { dirname } from "node:path";
import { client } from "./main.mjs";
import { s } from "@sapphire/shapeshift";
import { fileURLToPath } from "node:url";
import { addCommandToWebsite } from "@riskybot/command";

const envRequirements = s.object({
    IMGEN_APPLICATION_CLIENT_SECRET: s.string,
    IMGEN_APPLICATION_ID: s.string,
    OWNER_GUILD_ID: s.string.optional,
});

const env = envRequirements.parse(process.env);

client.deployCommands({
    applicationId: env.IMGEN_APPLICATION_ID,
    clientSecret: env.IMGEN_APPLICATION_CLIENT_SECRET,
    guildId: env.OWNER_GUILD_ID,
});

// Not necessary if you don't have a website
const __dirname = dirname(fileURLToPath(import.meta.url));
addCommandToWebsite(client.getAPICommands(), __dirname);
