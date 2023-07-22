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
    title: "Error with Reddit",
    message: "An unknown error occurred with [Reddit API](https://reddit.com/)",
};

export async function randomPostInSubreddit(subreddit: string): Promise<Post | null> {
    const searchParams = new URLSearchParams({ sort: "top", t: "daily", limit: "500", include_over_18: "false" });
    const result = await fetch(`${redditBaseURL}/r/${encodeURIComponent(subreddit)}/random.json?${searchParams}`);

    if (result.status === 404) {
        // No error because it's a 404
        return null;
    } else if (!result.ok) {
        throw new APIError(genericRedditError, result, await result.text());
    }

    // A "bug" but it signifies that the subreddit doesn't exist
    if (result.url.startsWith("https://www.reddit.com/subreddits/search.json")) {
        return null;
    }

    const post = await result.json() as RawPostResult[];

    const verify = rawPostResult.run(post[0]);
    if (verify.isErr() || !verify.value) {
        throw new APIError(genericRedditError, result, JSON.stringify(verify.error, null, 2));
    }


    // format it better because it is overly complicated
    return verify.value.data.children?.[0].data as Post;

}

// Queries stay queried for 1 hour
const autoCompleteCache = new LRUCache<string, SubredditAutoComplete>({ max: 500, ttl: 1000 * 60 * 60 });

export async function subredditAutoComplete(query: string, cache = true): Promise<SubredditAutoComplete | null> {
    if (cache) {
        const cached = autoCompleteCache.get(query);
        if (cached) {
            return cached;
        }
    }

    const searchParams = new URLSearchParams({ query });
    const result = await fetch(`${redditBaseURL}/api/subreddit_autocomplete.json?${searchParams}`);

    if (result.status === 404) {
        // No error because it's a 404
        return null;
    } else if (!result.ok) {
        throw new APIError(genericRedditError, result, await result.text());
    }

    const subreddits = await result.json() as RawSubredditAutoCompleteResult;

    if (!subreddits?.subreddits?.length) {
        return null;
    }

    const verify = rawSubredditAutoCompleteResult.run(subreddits);
    if (verify.isErr()) {
        throw new APIError(genericRedditError, result, JSON.stringify(verify.error, null, 2));
    }

    autoCompleteCache.set(query, subreddits.subreddits);
    return subreddits.subreddits;
}

const popularSubredditsCache = new LRUCache<string, SubredditInfo[]>({ max: 1, ttl: 1000 * 60 * 60 * 24 });

export async function popularSubreddits(cache = true): Promise<SubredditInfo[]> {
    if (cache) {
        const cached = popularSubredditsCache.get("popular");
        if (cached) {
            return cached;
        }
    }

    const result = await fetch(`${redditBaseURL}/subreddits/popular.json`);

    if (!result.ok) {
        throw new APIError(genericRedditError, result, await result.text());
    }

    const subreddits = await result.json() as RawPopularSubreddits;

    const verify = rawPopularSubreddits.run(subreddits);
    if (verify.isErr()) {
        throw new APIError(genericRedditError, result, JSON.stringify(verify.error, null, 2));
    }

    const data =  subreddits["data"]["children"].map(sub => sub.data) as SubredditInfo[];
    popularSubredditsCache.set("popular", data);
    return data;
}


const subredditInfoCache = new LRUCache<string, SubredditInfoResult>({ max: 100, ttl: 1000 * 60 * 60 });

export async function subredditInfo(subreddit: string, cache = true): Promise<SubredditInfoResult | null> {
    if (cache) {
        const cached = subredditInfoCache.get(subreddit);
        if (cached) {
            return cached;
        }
    }


    const result = await fetch(`${redditBaseURL}/r/${encodeURIComponent(subreddit)}/about.json`);

    if (result.status === 404) {
        // No error because it's a 404
        return null;
    } else if (!result.ok) {
        throw new APIError(genericRedditError, result, await result.text());
    }

    const info = await result.json() as RawSubredditInfoResult;

    const verify = rawSubredditInfoResult.run(info);
    if (verify.isErr() || !verify.value) {
        throw new APIError(genericRedditError, result, JSON.stringify(verify.error, null, 2));
    }

    subredditInfoCache.set(subreddit, verify.value["data"]);
    return verify.value["data"];
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

// TODO: fill in the rest of the fields
const post = s.object({
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
});

type Post = InferType<typeof post>;


const rawPostResult = s.object({
    kind: s.literal("Listing"),
    data: s.object({
        after: s.unknown,
        dist: s.number.nullable.optional,
        modhash: s.string,
        geo_filter: s.string,
        children: s.object({
            // kind: s.enum(RedditFullnamesTypePrefixes.Comment, RedditFullnamesTypePrefixes.Link ),
            data: post.nullable.optional
        }).array.nullable.optional,
        before: s.unknown
    })
});

type RawPostResult = InferType<typeof post>;

// TODO: fill in the rest of the fields
const subredditInfoObject = s.object({
    name: s.string,
    public_description: s.string,
    title: s.string,
    subscribers: s.number,
    icon_img: s.string,
    community_icon: s.string,
    display_name_prefixed: s.string,
    url: s.string.transform((url) => redditBaseURL + url),
    created_utc: s.number,
});

export type SubredditInfo = InferType<typeof subredditInfoObject>;

// TODO: fill in the rest of the fields
const autoCompleteSubreddit = s.object({
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

});
/** These are from the api docs - they might not all exist */
const rawSubredditAutoCompleteResult = s.object({
    subreddits: autoCompleteSubreddit.array
});

type RawSubredditAutoCompleteResult = InferType<typeof rawSubredditAutoCompleteResult>;
export type SubredditAutoComplete = InferType<typeof autoCompleteSubreddit>[];



const rawPopularSubreddits = s.object({
    kind: s.literal("Listing"),
    data: s.object({
        after: s.unknown,
        dist: s.number.nullable.optional,
        modhash: s.string,
        geo_filter: s.string,
        children: s.object({
            // kind: s.enum(RedditFullnamesTypePrefixes.Comment, RedditFullnamesTypePrefixes.Link ),
            data: subredditInfoObject.nullable.optional
        }).array,
        before: s.unknown
    })
});

type RawPopularSubreddits = InferType<typeof rawPopularSubreddits>;
export type PopularSubreddits = InferType<typeof subredditInfoObject>[];

/** These are from the api docs - they might not all exist */
const rawSubredditInfoResult = s.object({
    kind: s.literal(RedditFullnamesTypePrefixes.Subreddit),
    data: subredditInfoObject,
});

type RawSubredditInfoResult = InferType<typeof rawSubredditInfoResult>;
export type SubredditInfoResult = InferType<typeof subredditInfoObject>;
