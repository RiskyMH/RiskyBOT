import { APIError } from "./global.ts";
import { LRUCache } from "lru-cache";
import { type Output, string, optional, array, nullable, transform, literal, object, boolean, number, safeParse, unknown, union, url } from "valibot";

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

// TODO: fill in the rest of the fields (post, subreddit, etc.)

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

    const parsed = safeParse(PostResultSchema, post[0]);

    if (!parsed.success || parsed.issues) {
        throw new APIError(genericRedditError, result, JSON.stringify(parsed.issues, null, 2));
    }

    // format it better because it is overly complicated
    return parsed.output.data.children?.[0].data ?? null;
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

    const parsed = safeParse(rawSubredditAutoCompleteResult, subreddits);

    if (!parsed.success || parsed.issues) {
        throw new APIError(genericRedditError, result, JSON.stringify(parsed.issues, null, 2));
    }

    autoCompleteCache.set(query, parsed.output.subreddits);
    return parsed.output.subreddits;
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

    const parsed = safeParse(rawPopularSubreddits, subreddits);

    if (!parsed.success || parsed.issues) {
        throw new APIError(genericRedditError, result, JSON.stringify(parsed.issues, null, 2));
    }

    const data = parsed.output.data.children.map(sub => sub.data) as SubredditInfo[];
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

    const parsed = safeParse(rawSubredditInfoResult, info);

    if (!parsed.success || parsed.issues) {
        throw new APIError(genericRedditError, result, JSON.stringify(parsed.issues, null, 2));
    }

    subredditInfoCache.set(subreddit, parsed.output.data);
    return parsed.output.data;
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

const PostSchema = object({
    subreddit: string(),
    selftext: string(),
    title: string(),
    subreddit_name_prefixed: string(),
    hidden: boolean(),
    downs: number(),
    upvote_ratio: number(),
    ups: number(),
    edited: boolean(),
    created: number(),
    over_18: boolean(),
    spoiler: boolean(),
    id: string(),
    permalink: string(),
    url: string(),
    created_utc: number(),
    num_crossposts: number(),
    domain: string(),
    is_video: boolean(),
    num_comments: number(),
    author: string(),
});

type Post = Output<typeof PostSchema>;


const PostResultSchema = object({
    kind: literal("Listing"),
    data: object({
        after: unknown(),
        dist: optional(nullable(number())),
        modhash: string(),
        geo_filter: string(),
        children: optional(nullable(array(object({
            // kind: s.enum(RedditFullnamesTypePrefixes.Comment, RedditFullnamesTypePrefixes.Link ),
            data: optional(nullable(PostSchema))
        })))),
        before: unknown()
    })
});

type RawPostResult = Output<typeof PostSchema>;

const SubredditInfoObjectSchema = object({
    name: string(),
    public_description: string(),
    title: string(),
    subscribers: number(),
    icon_img: string(),
    community_icon: string(),
    display_name_prefixed: string(),
    url: transform(string(), url => redditBaseURL + url),
    created_utc: number(),
});

export type SubredditInfo = Output<typeof SubredditInfoObjectSchema>;

const AutoCompleteSubredditSchema = object({
    numSubscribers: number(),
    name: string(),
    allowedPostTypes: object({
        images: boolean(),
        text: boolean(),
        videos: boolean(),
        links: boolean(),
        spoilers: boolean(),
    }),
    id: string(),
    primaryColor: string(),
    communityIcon: union([literal(""), string(undefined, [url()])]),
    icon: union([literal(""), string(undefined, [url()])]),

});
/** These are from the api docs - they might not all exist */
const rawSubredditAutoCompleteResult = object({
    subreddits: array(AutoCompleteSubredditSchema)
});

type RawSubredditAutoCompleteResult = Output<typeof rawSubredditAutoCompleteResult>;
export type SubredditAutoComplete = Output<typeof AutoCompleteSubredditSchema>[];



const rawPopularSubreddits = object({
    kind: literal("Listing"),
    data: object({
        after: unknown(),
        dist: optional(nullable(number())),
        modhash: string(),
        geo_filter: string(),
        children: array(object({
            // kind: s.enum(RedditFullnamesTypePrefixes.Comment, RedditFullnamesTypePrefixes.Link ),
            data: optional(nullable(SubredditInfoObjectSchema))
        })),
        before: unknown()
    })
});

type RawPopularSubreddits = Output<typeof rawPopularSubreddits>;
export type PopularSubreddits = Output<typeof SubredditInfoObjectSchema>[];

/** These are from the api docs - they might not all exist */
const rawSubredditInfoResult = object({
    kind: literal(RedditFullnamesTypePrefixes.Subreddit),
    data: SubredditInfoObjectSchema,
});

type RawSubredditInfoResult = Output<typeof rawSubredditInfoResult>;
export type SubredditInfoResult = Output<typeof SubredditInfoObjectSchema>;
