import { ArrayValidator, InferType, s } from "@sapphire/shapeshift";
import { fetch } from "undici";

const redditBaseURL = "https://reddit.com/";

export async function rawRandomPostInSubreddit(subreddit: string): Promise<RawPostResult | null | undefined> {
    subreddit.replace("r/", "");
    const rawResult = await fetch(redditBaseURL + "r/" + (encodeURIComponent(subreddit)) + "/random.json?" + new URLSearchParams({ sort: "top", t: "daily", limit: "500", include_over_18: "false" }));

    if (rawResult.status === 404) {
        return null;
    } else if (!rawResult.ok) {
        return undefined;
    }

    const result = await rawResult.json() as RawPostResult;

    // Just so it isn't validated
    result[1].data.children = null;

    if (!result[0]?.data.children?.[0].data) {
        return null;
    }

    return rawPostResult.parse(result);
}

export async function rawAutoComplete(query: string, limit?: number): Promise<RawSubredditAutoCompleteResult | null | undefined> {
    const rawResult = await fetch(redditBaseURL + "api/subreddit_autocomplete.json?" + new URLSearchParams({ query, limit: (limit ?? 5).toString() }));

    if (rawResult.status === 404) {
        return null;
    } else if (!rawResult || rawResult.status !== 200) {
        return undefined;
    }

    const result = await rawResult.json() as RawSubredditAutoCompleteResult;

    if (!result.subreddits.length) {
        return null;
    }

    return RawSubredditAutoCompleteResult.parse(result);
}

/** Always returns a list of strings - null if error or no results */
export async function randomPostInSubreddit(subreddit: string): Promise<PostResult | null | undefined> {
    let result: RawPostResult | null | undefined;
    try {
        result = await rawRandomPostInSubreddit(subreddit);
    } catch (e) {
        console.warn(e);
        return undefined;
    }

    if (!result || !result[0]?.data?.children?.[0]?.data) {
        if (result === undefined) return undefined;
        if (result === null) return null;
        return null;
    }

    let post: PostResult;

    {
        post = result[0].data.children?.[0].data as PostResult;

    }

    return post;
}

/** Always returns a list of strings - list of none if error or no results */
export async function subredditAutoComplete(term: string, amount?: number): Promise<SubredditAutoCompleteResult[] | null | undefined> {
    let result: RawSubredditAutoCompleteResult | null | undefined;
    try {
        result = await rawAutoComplete(term, amount);
    } catch (e) {
        console.warn(e);
        return undefined;
    }

    if (!result || !result.subreddits.length) {
        if (result === undefined) return undefined;
        if (result === null) return null;
        return null;
    }

    const safeResult: SubredditAutoCompleteResult[] = [];

    for (const res of result.subreddits) {
        const subreddit = {} as SubredditAutoCompleteResult;

        subreddit.allowedPostTypes = res.allowedPostTypes;
        subreddit.communityIcon = res.communityIcon;
        subreddit.icon = res.icon;
        subreddit.id = res.id as SubredditAutoCompleteResult["id"];
        subreddit.name = res.name;
        subreddit.numSubscribers = res.numSubscribers;
        subreddit.primaryColor = res.primaryColor as SubredditAutoCompleteResult["primaryColor"];

        safeResult.push(subreddit);
    }

    return safeResult;
}

/** https://www.reddit.com/dev/api/ `type prefixes` */
export enum RedditFullnamesTypePrefixes {
    Comment = "t1",
    Account = "t2",
    Link = "t3",
    Message = "t4",
    Subreddit = "t5",
    Award = "t6"
}

/** These are from the api docs - they might not all exist */
export const rawPostResult = s.array(
    s.object({
        kind: s.literal("Listing"),
        data: s.object({
            after: s.unknown,
            dist: s.number.nullable.optional,
            modhash: s.string,
            geo_filter: s.string,
            children: s.object({
                // kind: s.enum(RedditFullnamesTypePrefixes.Comment, RedditFullnamesTypePrefixes.Link ),
                data: s.object({
                    subreddit: s.string,
                    selftext: s.string,
                    title: s.string,
                    subreddit_name_prefixed: s.string,
                    hidden: s.boolean,
                    downs: s.number,
                    upvote_ratio: s.number,
                    ups: s.number,
                    edited: s.boolean,
                    created: s.number,
                    over_18: s.boolean,
                    spoiler: s.boolean,
                    id: s.string,
                    permalink: s.string,
                    url: s.string,
                    created_utc: s.number,
                    num_crossposts: s.number,
                    domain: s.string,
                    is_video: s.boolean,
                    num_comments: s.number,
                    author: s.string,
                }).nullable.optional.setValidationEnabled(false)
            }).array.nullable.optional,
            before: s.unknown
        })
    }),
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type InferArrayType<T extends ArrayValidator<any>> = T extends ArrayValidator<any, infer U> ? U[] : never;
export type RawPostResult = InferArrayType<typeof rawPostResult>;

/** These are from the api docs - they might not all exist */
export const RawSubredditAutoCompleteResult = s.object({
    subreddits: s.object({
        numSubscribers: s.number,
        name: s.string,
        allowedPostTypes: s.object({
            images: s.boolean,
            text: s.boolean,
            videos: s.boolean,
            links: s.boolean,
            spoilers: s.boolean,
        }),
        id: s.string,
        primaryColor: s.string,
        communityIcon: s.union(s.literal(""), s.string.url()),
        icon: s.union(s.literal(""), s.string.url()),
    }).array
});
export type RawSubredditAutoCompleteResult = InferType<typeof RawSubredditAutoCompleteResult>;

/** a list of strings */
export type SubredditAutoCompleteResult = {
    numSubscribers: number,
    name: string,
    allowedPostTypes: {
        images: boolean,
        text: boolean,
        videos: boolean,
        links: boolean,
        spoilers: boolean,
    },
    id: `${RedditFullnamesTypePrefixes.Subreddit}_${string}`,
    primaryColor: `#${string}`,
    communityIcon: string,
    icon: string,
};


/** 
 * https://www.reddit.com/dev/api/ but only the useful (in my opinion)
 * 
 * Example url: https://www.reddit.com/r/memes/random.json
 */
export type PostResult = {
    /** the name of the subreddit */
    subreddit: string;
    /** the text that the author provides - somethimes empty */
    selftext: string;
    /** the title of the post */
    title: string
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
            // childrena: {
            //     /** array of posts - only ever one */
            //     [key: number]: {
            //         /** https://www.reddit.com/dev/api/ `type prefixes` */
            //         kind: RedditFullnamesTypePrefixes;
            //         data: PostResult;
            //     };
            // };
            /** array of posts - only ever one */
            children: Record<number, {
                /** https://www.reddit.com/dev/api/ `type prefixes` */
                kind: RedditFullnamesTypePrefixes;
                data: PostResult;
            }>;
        };
    };
    /** Comments */
    // eslint-disable-next-line @typescript-eslint/ban-types
    1: {

    };
};

// export default {}

let a = 1;
a++;
console.info(a);
