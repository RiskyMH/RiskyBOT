// import { Config } from "./tools.mjs";

// Helpers
type colorType = import("discord.js").HexColorString;


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
/** Which APIs will be enabled */
type ApiEnabled = {
    reddit: boolean;
    topgg: boolean;
    deepai: boolean;
    nekobot: boolean;
    someRandomApi: boolean;
    urbandictionary: boolean;
    googletranslate: boolean;
    randomSmallOnes: {
        pastegg: boolean;
        rhymebrain: boolean;
        awsrandomcat: boolean;
        dogceo: boolean;
        icanhazdadjoke: boolean;
        forismatic: boolean;
        affirmationsdev: boolean;
        evilinsultcom: boolean;
        excuserheroku: boolean;
        uselessfactspl: boolean;
        shibeonline: boolean;
        randomduk: boolean;
        zooanimalapiheroku: boolean;
        emojihubheroku: boolean;
        
    }
}

/** The settings for the bot */
export type ConfigJSON = {
    /** The colors the bot uses - taken from https://discord.com/branding */
    colors: ConfigColors;
    apiEnabled: ApiEnabled;
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