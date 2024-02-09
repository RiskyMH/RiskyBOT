import { APIError } from "./global.ts";
import { type Output, string, optional, array, nullable, transform, object, boolean, number, safeParse } from "valibot";

const topggBaseUrl = "https://top.gg/api";

const topggAuthor = {
    name: "Top.gg",
    url: "https://top.gg/",
    image: "https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png",
};

const genericTopggError = {
    author: topggAuthor,
    title: "Error with Top.gg",
    message: "An unknown error occurred with [Top.gg API](https://top.gg/)",
};

export async function userInfo(id: string, topggKey: string): Promise<UserInfo | null> {

    const headers = {
        Authorization: topggKey,
        "Content-Type": "application/json",
    };

    const result = await fetch(topggBaseUrl + "/users/" + id, { headers });

    if (result.status === 404) {
        // No error because it's a 404
        return null;
    } else if (!result.ok) {
        throw new APIError(genericTopggError, result, await result.text());
    }

    const user = await result.json() as UserInfoResult;

    // Just in case
    if (!user) {
        return null;
    }

    const parsed = safeParse(UserInfoResultSchema, user);

    if (!parsed.success || parsed.issues) {
        throw new APIError(genericTopggError, result, JSON.stringify(parsed.issues, null, 2));
    }

    return parsed.output;
}


export async function botInfo(id: string, topggKey: string): Promise<BotInfo | null> {

    const headers = {
        Authorization: topggKey,
        "Content-Type": "application/json",
    };

    const result = await fetch(topggBaseUrl + "/bots/" + id, { headers });

    if (result.status === 404) {
        // No error because it's a 404
        return null;
    } else if (!result.ok) {
        throw new APIError(genericTopggError, result, await result.text());
    }


    const bot = await result.json() as BotInfoResult;

    // Just in case
    if (!bot) {
        return null;
    }

    const parsed = safeParse(BotInfoResultSchema, bot);

    if (!parsed.success || parsed.issues) {
        throw new APIError(genericTopggError, result, JSON.stringify(parsed.issues, null, 2));
    }

    return parsed.output;
}


/** Description from https://docs.top.gg/api/bot/ */
const BotInfoResultSchema = object({
    /** The id of the bot */
    id: string(),
    /** The username of the bot */
    username: string(),
    /** The discriminator of the bot */
    discriminator: string(),
    /** The avatar hash of the bot's avatar */
    avatar: optional(string()),
    /** The cdn hash of the bot's avatar if the bot has none */
    defAvatar: string(),
    /** The URL for the banner image */
    bannerUrl: nullable(string()),
    /** The prefix of the bot */
    prefix: string(),
    /** The short description of the bot */
    shortdesc: string(),
    /** The long description of the bot. Can contain HTML and/or Markdown */
    longdesc: string(),
    /** The tags of the bot */
    tags: array(string()),
    /** The website url of the bot */
    website: optional(string()),
    /** The support server invite code of the bot */
    support: optional(string()),
    /** The link to the github repo of the bot */
    github: optional(string()),
    /** The owners of the bot. First one in the array is the main owner */
    owners: array(string()),
    /** The guilds featured on the bot page */
    guilds: array(string()),
    /** The custom bot invite url of the bot */
    invite: optional(string()),
    /** The date when the bot was approved (in ISO 8601) */
    date: string(),
    /** The amount of servers the bot has according to posted stats. */
    server_count: transform(optional(number()), s => s ?? 0),
    /** The certified status of the bot */
    certifiedBot: boolean(),
    /** The vanity url of the bot */
    vanity: optional(string()),
    /** The amount of upvotes the bot has */
    points: number(),
    /** The amount of upvotes the bot has this month */
    monthlyPoints: number(),
    /** The guild id for the donatebot setup */
    donatebotguildid: nullable(string()),
});

type BotInfoResult = Output<typeof BotInfoResultSchema>;
export type BotInfo = Output<typeof BotInfoResultSchema>;


/** Description from https://docs.top.gg/api/bot/ */
const UserInfoResultSchema = object({
    /** The id of the user */
    id: string(),
    /** The username of the user*/
    username: string(),
    /** The discriminator of the user*/
    discriminator: string(),
    /** The avatar hash of the user's avatar */
    avatar: optional(string()),
    /** The cdn hash of the user's avatar if the user has none */
    defAvatar: string(),
    /** The bio of the user */
    bio: optional(string()),
    /** The banner image url of the user */
    banner: optional(string()),
    /** The social usernames of the user */
    social: optional(object({
        /** The youtube channel id of the user */
        youtube: optional(string()),
        /** The reddit username of the user */
        reddit: optional(string()),
        /** The twitter username of the user */
        twitter: optional(string()),
        /** The instagram username of the user */
        instagram: optional(string()),
        /** The github username of the user */
        github: optional(string()),
    })),
    /** The custom hex color of the user */
    color: optional(string()),
    /** The supporter status of the user */
    supporter: boolean(),
    /** The certified status of the user */
    certifiedDev: boolean(),
    /** The mod status of the use r*/
    mod: boolean(),
    /** The website moderator status of the user */
    webMod: boolean(),
    /** The admin status of the user */
    admin: boolean(),
});

type UserInfoResult = Output<typeof UserInfoResultSchema>;
export type UserInfo = Output<typeof UserInfoResultSchema>;
