import { client } from "./main.mjs";
import { s } from "@sapphire/shapeshift";

const envRequirements = s.object({
    RISKYBOT_APPLICATION_CLIENT_SECRET: s.string,
    RISKYBOT_APPLICATION_ID: s.string,
    OWNER_GUILD_ID: s.string.optional,
});

const env = envRequirements.parse(process.env);

client.deployCommands({
    applicationId: env.RISKYBOT_APPLICATION_ID,
    clientSecret: env.RISKYBOT_APPLICATION_CLIENT_SECRET,
    guildId: env.OWNER_GUILD_ID,
});