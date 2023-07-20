import { InferType, s } from "@sapphire/shapeshift";
import { fetch } from "undici";
import { APIError } from "./global.mjs";
import { LRUCache } from "lru-cache";

const redditBaseURL = "https://reddit.com";

const redditAuthor = {
    name: "Reddit",
    url: "https://reddit.com",
    image: "https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png",
};

const genericRedditError = {
    author: redditAuthor,
    message: "Error with Reddit",
    title: "An unknown error occurred with [Reddit API](https://reddit.com/)",
};

// TODO: subreddit info

export async function randomPostInSubreddit(subreddit: string): Promise<PostResult | null> {
    const searchParams = new URLSearchParams({ sort: "top", t: "daily", limit: "500", include_over_18: "false" });
    const result = await fetch(`${redditBaseURL}/r/${encodeURIComponent(subreddit)}/random.json?${searchParams}`);

    if (result.status === 404) {
        // No error because it's a 404
        return null;
    } else if (!result.ok) {
        throw new APIError(genericRedditError, result);
    }

    // A "bug" but it signifies that the subreddit doesn't exist
    if (result.url.startsWith("https://www.reddit.com/subreddits/search.json")) {
        return null;
    }

    const post = await result.json() as RawPostResult[];

    const verify = rawPostResult.run(post[0]);
    if (verify.isErr() || !verify.value) {
        throw new APIError(genericRedditError, result, JSON.stringify(verify.error));
    }


    // format it better because it is overly complicated
    return verify.value.data.children?.[0].data as PostResult;

}

// Queries stay queried for 1 hour
const autoCompleteCache = new LRUCache<string, SubredditAutoCompleteResult>({ max: 1000, ttl: 1000 * 60 * 60 });

export async function subredditAutoComplete(query: string, limit = 5, cache = true): Promise<SubredditAutoCompleteResult | null | undefined> {
    if (cache) {
        const cached = autoCompleteCache.get(query);
        if (cached?.length === limit) {
            return cached;
        }
    }

    const searchParams = new URLSearchParams({ query, limit: limit.toString() });
    let url = `${redditBaseURL}/api/subreddit_autocomplete.json?${searchParams}`;
    if (query.length === 0) url = `${redditBaseURL}/subreddits/popular.json?limit=${limit}`;
    const result = await fetch(url);

    if (result.status === 404) {
        // No error because it's a 404
        return null;
    } else if (!result.ok) {
        throw new APIError(genericRedditError, result);
    }

    const subreddits = await result.json() as RawSubredditAutoCompleteResult;

    if (!subreddits?.subreddits?.length) {
        return null;
    }

    const verify = RawSubredditAutoCompleteResult.run(subreddits);
    if (verify.isErr()) {
        throw new APIError(genericRedditError, result, JSON.stringify(verify.error));
    }

    autoCompleteCache.set(query, subreddits.subreddits);
    return subreddits.subreddits;
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
export const rawPostResult = s.object({
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
            }).nullable.optional
        }).array.nullable.optional,
        before: s.unknown
    })
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// declare type InferArrayType<T extends ArrayValidator<any>> = T extends ArrayValidator<any, infer U> ? U[] : never;
export type RawPostResult = InferType<typeof rawPostResult>;

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

/** The autocomplete of subreddits*/
export type SubredditAutoCompleteResult = RawSubredditAutoCompleteResult["subreddits"];


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
    id: string
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

