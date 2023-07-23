
import { describe, it } from "node:test";
import assert from "node:assert";
import { smallApis } from "../../dist/index.mjs";

describe("Text APIs", async () => {

    const word = "hello";
    it(`should provide a rhyme for ${word}`, async () => {
        const result = await smallApis.getRhymes(word);
        assert.ok(result);
    });


});
