import { client } from "./main.ts";
import { object, string, parse, optional } from "valibot";

const EnvRequirementsSchema = object({
    RISKYBOT_APPLICATION_CLIENT_SECRET: string(),
    RISKYBOT_APPLICATION_ID: string(),
    OWNER_GUILD_ID: optional(string()),
});

export const env = parse(EnvRequirementsSchema, process.env);

client.deployCommands({
    applicationId: env.RISKYBOT_APPLICATION_ID,
    clientSecret: env.RISKYBOT_APPLICATION_CLIENT_SECRET,
    guildId: env.OWNER_GUILD_ID,
});
