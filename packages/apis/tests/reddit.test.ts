import { describe, expect, it } from "bun:test";
import { reddit } from "@riskybot/apis";

describe("Reddit random post", async () => {
    const validSubreddit = "meme";
    it(`should get a post for "r/${validSubreddit}"`, async () => {
        const result = await reddit.randomPostInSubreddit(validSubreddit);
        expect(result).toBeTruthy();
    });

    const invalidSubreddit = "￼";
    it(`should NOT get a post for "r/${invalidSubreddit}"`, async () => {
        const result = await reddit.randomPostInSubreddit(invalidSubreddit);
        expect(result).toBeNull();
    });

});

describe("Reddit subreddit autocomplete", async () => {
    const validQuery = "meme";
    it(`should get subreddits for query "${validQuery}" (length >= 1)`, async () => {
        const result = await reddit.subredditAutoComplete(validQuery) ?? [];
        expect(result).toBeTruthy();
        expect(result?.length).toBeGreaterThanOrEqual(1);
    });

    const invalidQuery = "￼";
    it(`should NOT get subreddits for query "${validQuery}"`, async () => {
        const result = await reddit.subredditAutoComplete(invalidQuery);
        expect(result).toBeNull();
    });

});

describe("Reddit subreddit info", async () => {
    const validQuery = "meme";
    it(`should get a subreddit for query "${validQuery}"`, async () => {
        const result = await reddit.subredditInfo(validQuery) ?? [];
        expect(result).toBeTruthy();
    });

    const invalidQuery = "￼";
    it(`should NOT get a subreddit for query "${validQuery}"`, async () => {
        const result = await reddit.subredditAutoComplete(invalidQuery);
        expect(result).toBeNull();
    });

});
