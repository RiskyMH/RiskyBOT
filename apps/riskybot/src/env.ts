import { s } from "@sapphire/shapeshift";


const envRequirements = s.object({
    RISKYBOT_APPLICATION_PUBLIC_KEY: s.string,
    TOPGG_TOKEN: s.string.optional,
    OWNER_GUILD_ID: s.string.optional,
    OWNER_USER_ID: s.string.transform((v) => v.split(",")).default([]),
});


export const env = envRequirements.parse(process.env);
