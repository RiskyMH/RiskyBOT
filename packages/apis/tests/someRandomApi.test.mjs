import { describe, it } from "node:test";
import assert from "node:assert";
import { someRandomApi } from "../dist/index.mjs";

describe("SomeRandomApi Lyrics", async () => {
    const validSong = "hello";
    it(`should get lyrics for "${validSong}"`, async () => {
        const result = await someRandomApi.getLyrics(validSong);
        assert.ok(result);
    });

    const invalidWord = "￼";
    it(`should NOT get lyrics for "${invalidWord}"`, async () => {
        const result = await someRandomApi.getLyrics(invalidWord);
        assert.ok(result === null);
    });

});
