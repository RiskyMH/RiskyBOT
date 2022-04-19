// Helpers
type colorType = import("discord.js").HexColorString;

// test
type abc = import("discord.js").CommandInteractionOption;
export interface CommandInteractionOptionWithExtra extends abc {
id?: string
}



//? //////////// ?////////////////////////////
//? Config File  ?/////////////////////////// 
//? //////////   ?//////////////////////////

/** The colors the bot uses - taken from https://discord.com/branding */
type ConfigColors = {
 /** When something has completed normally */
 ok: colorType;
 /** When something has an error */
 error: colorType;
 /** When something has had a good outcome */
 good: colorType;
 /** When something has not fully complected... */
 warning: colorType;
};

/** The settings for the bot */
export type ConfigJSON = {
    /** The colors the bot uses - taken from https://discord.com/branding */
    colors: ConfigColors;
};


//? //////////// ?////////////////////////////
//? TOP.GG       ?///////////////////////////
//? //////////   ?//////////////////////////

/** Description from https://docs.top.gg/api/bot/ */
type topggBot = {
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
type topggUser = {
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

// export type topggapiResponse = {} extends import("discord.js").User["bot"]? topggBot: topggUser
export type topggapiResponse = {
    /** Description from https://docs.top.gg/api/bot/ */
    bots: topggBot;
    /** Description from https://docs.top.gg/api/user/ */
    users: topggUser;
};


//? //////////// ?////////////////////////////
//? REDDIT       ?///////////////////////////
//? //////////   ?//////////////////////////
/** https://www.reddit.com/dev/api/ `type prefixes` */
type RedditFullnamesTypePrefixes = string | "t1" | "t2" | "t3" | "t4" | "t5" | "t6";

/** 
 * https://www.reddit.com/dev/api/ but only the useful (in my opinion)
 * example: https://www.reddit.com/r/memes/random.json
 */
export type RedditRandomSubredditPosts = {
    /** The actual post */
    0: {
        kind: string;
        data: {
            /** https://www.reddit.com/dev/api#modhashes */
            modhash: string;
            /**  */
            children: {
                /** array of posts - only ever one */
                [key: number]: {
                    /** https://www.reddit.com/dev/api/ `type prefixes` */
                    kind: RedditFullnamesTypePrefixes;
                    data: {
                        /** idk */
                        approved_at_utc?: null;
                        /** the name of the subreddit */
                        subreddit: string;
                        /** the text that the author provides - somethimes empty */
                        selftext: string;
                        /** idk, self-explanatory? */
                        mod_reason_title?: string;
                        /** the title of the post */
                        title: string
                        /** the names of the flair */
                        // eslint-disable-next-line @typescript-eslint/ban-types
                        link_flair_richtext: {}
                        /** same as `subreddit` but has `r/` appended*/
                        subreddit_name_prefixed: `r/${string}`
                        /** is hidden? */
                        hidden: boolean
                        /** how many down votes */
                        downs: number
                        /** how many up votes */
                        ups: number
                        num_comments: number
                        /** the ration between `ups` and `downs` */
                        upvote_ratio: number
                        /** the url of either img,vid,post */
                        url: string
                        over_18: boolean
                        created: number
                        created_utc: number
                        author: string
                        permalink: `r/"${string}/comments/${string}/${string}/${string}"`
                        is_video: boolean;
                        domain: string

                    };
                };
            };
        };
    };
    /** Comments */
    // eslint-disable-next-line @typescript-eslint/ban-types
    1: {

    };
};

// todo: other apis used - and their types




// export default {}