import fetch from "node-fetch";

const topggBaseUrl = "https://top.gg/api";

export async function rawUserInfo(id: string, topggKey: string): Promise<RawUserInfoResult> {

    const headers = {
        Authorization: topggKey,
        "Content-Type": "application/json",
    };

    let result: RawUserInfoResult = await fetch( topggBaseUrl+ "/users/"+ id, { headers }).then((response) => response.json()) as RawUserInfoResult;

    if (!result) {
        console.log("Cant find top.gg user");
    }

    return result;
}

export async function rawBotInfo(id: string, topggKey: string): Promise<RawBotInfoResult> {

    const headers = {
        Authorization: topggKey,
        "Content-Type": "application/json",
    };

    let result: RawBotInfoResult = await fetch( topggBaseUrl+ "/bots/"+ id, { headers }).then((response) => response.json()) as RawBotInfoResult;

    if (!result) {
        console.log("Cant find top.gg bot");
    }

    return result;
}

export async function botInfo(id: string, topggKey: string): Promise<BotInfoResult|undefined> {
    let result: RawBotInfoResult;

    try {
        result = await rawBotInfo(id, topggKey);
        console.log(result);
    } catch {
        console.log("Cant find top.gg bot");
        return undefined;
    }

    // @ts-expect-error - error not in type
    if ((await result?.error?.toLowerCase()) === "not found")  result = undefined;

    if (!result) {
        return undefined;
    }

    let safeResult: BotInfoResult = {} as BotInfoResult;

    try{
        safeResult.id = String(result?.id || "");
        safeResult.username = String(result?.username || "");
        safeResult.discriminator = String(result?.discriminator || "");
        safeResult.avatar = result?.avatar ? String(result?.avatar) : undefined;
        safeResult.defAvatar = String(result?.defAvatar || "");
        safeResult.bannerUrl = result?.bannerUrl ? String(result?.bannerUrl) : undefined;
        safeResult.prefix = String(result?.prefix || "");
        safeResult.shortdesc = String(result?.shortdesc || "");
        safeResult.longdesc = String(result?.longdesc || "");
        safeResult.tags = [];
        for (let owner of result?.tags || []) safeResult.tags.push(String(owner || ""));
        safeResult.website = result?.website ? String(result?.website) : undefined;
        safeResult.support = result?.support ? String(result?.support) : undefined;
        safeResult.github = result?.github ? String(result?.github) : undefined;
        safeResult.owners = [];
        safeResult.guilds = [];
        for (let owner of result?.owners || []) safeResult.owners.push(String(owner || ""));
        for (let owner of result?.guilds || []) safeResult.guilds.push(String(owner || ""));
        safeResult.invite = result?.invite ? String(result?.invite) : undefined;
        safeResult.date = new Date(result?.invite?? new Date);
        safeResult.certifiedBot = Boolean(result?.certifiedBot ?? false);
        safeResult.vanity = result?.vanity ? String(result?.vanity) : undefined;
        safeResult.points = Number(result?.points ?? 0);
        safeResult.monthlyPoints = Number(result?.monthlyPoints ?? 0);
        safeResult.donatebotguildid = String(result?.donatebotguildid ?? "");

    } catch (err) {console.log(err); return undefined;}

}



/** Discord ID */
type Snowflake = string;

/** Description from https://docs.top.gg/api/bot/ */
export interface RawBotInfoResult {
    /** The id of the bot */
    id: Snowflake;
    /** The username of the bot */
    username: string;
    /** The discriminator of the bot */
    discriminator: string;
    /** The avatar hash of the bot's avatar */
    avatar?: string;
    /** The cdn hash of the bot's avatar if the bot has none */
    defAvatar: string;
    /** The URL for the banner image */
    bannerUrl?: string;
    /** The prefix of the bot */
    prefix: string;
    /** The short description of the bot */
    shortdesc: string;
    /** The long description of the bot. Can contain HTML and/or Markdown */
    longdesc: string;
    /** The tags of the bot */
    tags: string[];
    /** The website url of the bot */
    website?: string;
    /** The support server invite code of the bot */
    support?: string;
    /** The link to the github repo of the bot */
    github?: string;
    /** The owners of the bot. First one in the array is the main owner */
    owners: Snowflake[];
    /** The guilds featured on the bot page */
    guilds: Snowflake[];
    /** The custom bot invite url of the bot */
    invite?: string;
    /** The date when the bot was approved (in ISO 8601) */
    date: string;
    /** The certified status of the bot */
    certifiedBot: boolean;
    /** The vanity url of the bot */
    vanity?: string;
    /** The amount of upvotes the bot has */
    points: number;
    /** The amount of upvotes the bot has this month */
    monthlyPoints: number;
    /** The guild id for the donatebot setup */
    donatebotguildid: Snowflake;
}

/** Description from https://docs.top.gg/api/bot/ */
export interface RawUserInfoResult {
    /** The id of the user */
    id: Snowflake;
    /** The username of the user*/
    username: string;
    /** The discriminator of the user*/
    discriminator: string;
    /** The avatar hash of the user's avatar */
    avatar?: string;
    /** The cdn hash of the user's avatar if the user has none */
    defAvatar: string;
    /** The bio of the user */
    bio?: string;
    /** The banner image url of the user */
    banner?: string;
    /** The social usernames of the user */
    social: {
        /** The youtube channel id of the user */
        youtube?: string;
        /** The reddit username of the user */
        reddit?: string;
        /** The twitter username of the user */
        twitter?: string;
        /** The instagram username of the user */
        instagram?: string;
        /** The github username of the user */
        github?: string;
    };
    /** The custom hex color of the user */
    color: string;
    /** The supporter status of the user */
    supporter: boolean;
    /** The certified status of the user */
    certifiedDev: boolean;
    /** The mod status of the use r*/
    mod: boolean;
    /** The website moderator status of the user */
    webMod: boolean;
    /** The admin status of the user */
    admin: boolean;
}

export interface BotInfoResult {
    /** The id of the bot */
    id: Snowflake;
    /** The username of the bot */
    username: string;
    /** The discriminator of the bot */
    discriminator: string;
    /** The avatar hash of the bot's avatar */
    avatar?: string;
    /** The cdn hash of the bot's avatar if the bot has none */
    defAvatar: string;
    /** The URL for the banner image */
    bannerUrl?: string;
    /** The prefix of the bot */
    prefix: string;
    /** The short description of the bot */
    shortdesc: string;
    /** The long description of the bot. Can contain HTML and/or Markdown */
    longdesc: string;
    /** The tags of the bot */
    tags: string[];
    /** The website url of the bot */
    website?: string;
    /** The support server invite code of the bot */
    support?: string;
    /** The link to the github repo of the bot */
    github?: string;
    /** The owners of the bot. First one in the array is the main owner */
    owners: Snowflake[];
    /** The guilds featured on the bot page */
    guilds: Snowflake[];
    /** The custom bot invite url of the bot */
    invite?: string;
    /** The date when the bot was approved (in ISO 8601) */
    date: Date;
    /** The certified status of the bot */
    certifiedBot: boolean;
    /** The vanity url of the bot */
    vanity?: string;
    /** The amount of upvotes the bot has */
    points: number;
    /** The amount of upvotes the bot has this month */
    monthlyPoints: number;
    /** The guild id for the donatebot setup */
    donatebotguildid: Snowflake;
}