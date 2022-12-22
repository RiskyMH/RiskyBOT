import { describe, it } from "node:test";
import assert from "node:assert";
import { reddit } from "../dist/index.mjs";

// TODO: Add more tests

describe("Reddit random post", async () => {
    const validSubreddit = "meme";
    it(`should get a post for "r/${validSubreddit}"`, async () => {
        const result = await reddit.randomPostInSubreddit(validSubreddit);
        assert.ok(result);
    });

    const invalidSubreddit = "￼";
    it(`should NOT a post for "${invalidSubreddit}"`, async () => {
        const result = await reddit.randomPostInSubreddit(invalidSubreddit);
        assert.ok(result === null);
    });

});


describe("Reddit subreddit autocomplete", async () => {
    const validQuery = "meme";
    it(`should get subreddits for query "${validQuery}" (length >= 1)`, async () => {
        const result = await reddit.subredditAutoComplete(validQuery) ?? [];
        assert.ok(result?.length >= 1);
    });

    const invalidQuery = "￼";
    it(`should NOT get subreddits for query "${validQuery}"`, async () => {
        const result = await reddit.subredditAutoComplete(invalidQuery);
        assert.ok(result === null);
    });

});
