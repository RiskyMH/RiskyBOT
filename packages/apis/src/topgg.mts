import fetch from "node-fetch";

const topggBaseUrl = "https://top.gg/api";

export async function rawUser(id: string, topggKey: string): Promise<rawUserResult> {

    const headers = {
        Authorization: topggKey,
        "Content-Type": "application/json",
    };

    let result: rawUserResult = await fetch( topggBaseUrl+ "/users/"+ id, { headers }).then((response) => response.json()) as rawUserResult;

    if (!result) {
        console.log("Cant find top.gg user");
    }

    return result;
}

export async function rawBot(id: string, topggKey: string): Promise<rawBotResult> {

    const headers = {
        Authorization: topggKey,
        "Content-Type": "application/json",
    };

    let result: rawBotResult = await fetch( topggBaseUrl+ "/bots/"+ id, { headers }).then((response) => response.json()) as rawBotResult;

    if (!result) {
        console.log("Cant find top.gg bot");
    }

    return result;
}



/** Description from https://docs.top.gg/api/bot/ */
type rawBotResult = {
    /** The id of the bot */
    id: string;
    /** The username of the bot */
    username: string;
    /** The discriminator of the bot */
    discriminator: string;
    /** The avatar hash of the bot's avatar */
    avatar?: string;
    /** The cdn hash of the bot's avatar if the bot has none */
    defAvatar: string;
    /** The prefix of the bot */
    prefix: string;
    /** The short description of the bot */
    shortdesc: string;
    /** The long description of the bot. Can contain HTML and/or Markdown */
    longdesc?: string;
    /** The tags of the bot */
    tags: string[];
    /** The website url of the bot */
    website?: string;
    /** The support server invite code of the bot */
    support?: string;
    /** The link to the github repo of the bot */
    github?: string;
    /** of Snowflakes The owners of the bot. First one in the array is the main owner */
    owners: string[];
    /** of Snowflakes The guilds featured on the bot page */
    guilds: string[];
    /** The custom bot invite url of the bot */
    invite?: string;
    /** The date when the bot was approved */
    date: Date;
    /** The amount of servers the bot has according to posted stats. */
    server_count?: number;
    /** The amount of shards the bot has according to posted stats. */
    shard_count?: number;
    /** The certified status of the bot */
    certifiedBot: boolean;
    /** The vanity url of the bot */
    vanity?: string;
    /** The amount of upvotes the bot has */
    points: number;
    /** The amount of upvotes the bot has this month */
    monthlyPoints: number;
    /** The guild id for the donatebot setup */
    donatebotguildid?: string;
};
type rawUserResult = {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
    defAvatar: string;
    bio?: string;
    banner?: string;
    social: {
        youtube?: string;
        reddit?: string;
        twitter?: string;
        instagram?: string;
        github?: string;
    };
    color?: string;
    supporter: boolean;
    certifiedDev: boolean;
    mod: boolean;
    webMod: boolean;
    admin: boolean;
};

