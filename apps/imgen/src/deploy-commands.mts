import { client } from "./main.mjs";
import { s } from "@sapphire/shapeshift";

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