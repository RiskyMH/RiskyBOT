import { object, string, optional, transform, parse } from "valibot";

const EnvRequirementsSchema = object({
    RISKYBOT_APPLICATION_PUBLIC_KEY: string(),
    TOPGG_TOKEN: optional(string()),
    OWNER_GUILD_ID: optional(string()),
    OWNER_USER_ID: transform(optional(string()), v => v ? v.split(",") : []),
});


export const env = parse(EnvRequirementsSchema, process.env);
