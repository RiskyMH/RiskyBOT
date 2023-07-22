import { InferType, s } from "@sapphire/shapeshift";
import { fetch } from "undici";
import { APIError } from "./global.mjs";

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

    const verify = rawUserInfoResult.run(user);
    if (verify.isErr() || !verify.value) {
        throw new APIError(genericTopggError, result, JSON.stringify(verify.error, null, 2));
    }

    return verify.value;
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

    const verify = rawBotInfoResult.run(bot);
    if (verify.isErr() || !verify.value) {
        throw new APIError(genericTopggError, result, JSON.stringify(verify.error, null, 2));
    }

    return bot;
}


/** Description from https://docs.top.gg/api/bot/ */
const rawBotInfoResult = s.object({
    /** The id of the bot */
    id: s.string,
    /** The username of the bot */
    username: s.string,
    /** The discriminator of the bot */
    discriminator: s.string,
    /** The avatar hash of the bot's avatar */
    avatar: s.string.optional,
    /** The cdn hash of the bot's avatar if the bot has none */
    defAvatar: s.string,
    /** The URL for the banner image */
    bannerUrl: s.string.nullable,
    /** The prefix of the bot */
    prefix: s.string,
    /** The short description of the bot */
    shortdesc: s.string,
    /** The long description of the bot. Can contain HTML and/or Markdown */
    longdesc: s.string,
    /** The tags of the bot */
    tags: s.string.array,
    /** The website url of the bot */
    website: s.string.optional,
    /** The support server invite code of the bot */
    support: s.string.optional,
    /** The link to the github repo of the bot */
    github: s.string.optional,
    /** The owners of the bot. First one in the array is the main owner */
    owners: s.string.array,
    /** The guilds featured on the bot page */
    guilds: s.string.array,
    /** The custom bot invite url of the bot */
    invite: s.string.optional,
    /** The date when the bot was approved (in ISO 8601) */
    date: s.string,
    /** The amount of servers the bot has according to posted stats. */
    server_count: s.number.default(0),
    /** The certified status of the bot */
    certifiedBot: s.boolean,
    /** The vanity url of the bot */
    vanity: s.string.optional,
    /** The amount of upvotes the bot has */
    points: s.number,
    /** The amount of upvotes the bot has this month */
    monthlyPoints: s.number,
    /** The guild id for the donatebot setup */
    donatebotguildid: s.string.nullable,
});

type BotInfoResult = InferType<typeof rawBotInfoResult>;
export type BotInfo = InferType<typeof rawBotInfoResult>;


/** Description from https://docs.top.gg/api/bot/ */
const rawUserInfoResult = s.object({
    /** The id of the user */
    id: s.string,
    /** The username of the user*/
    username: s.string,
    /** The discriminator of the user*/
    discriminator: s.string,
    /** The avatar hash of the user's avatar */
    avatar: s.string.optional,
    /** The cdn hash of the user's avatar if the user has none */
    defAvatar: s.string,
    /** The bio of the user */
    bio: s.string.optional,
    /** The banner image url of the user */
    banner: s.string.optional,
    /** The social usernames of the user */
    social: s.object({
        /** The youtube channel id of the user */
        youtube: s.string.optional,
        /** The reddit username of the user */
        reddit: s.string.optional,
        /** The twitter username of the user */
        twitter: s.string.optional,
        /** The instagram username of the user */
        instagram: s.string.optional,
        /** The github username of the user */
        github: s.string.optional,
    }).optional,
    /** The custom hex color of the user */
    color: s.string.optional,
    /** The supporter status of the user */
    supporter: s.boolean,
    /** The certified status of the user */
    certifiedDev: s.boolean,
    /** The mod status of the use r*/
    mod: s.boolean,
    /** The website moderator status of the user */
    webMod: s.boolean,
    /** The admin status of the user */
    admin: s.boolean,
});

type UserInfoResult = InferType<typeof rawUserInfoResult>;
export type UserInfo = InferType<typeof rawUserInfoResult>;
