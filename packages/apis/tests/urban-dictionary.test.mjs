import assert from "node:assert";
import { describe, it } from "node:test";
import { urbanDictionary } from "../dist/index.mjs";

describe("Urban dictionary Define", async () => {
    const validWord = "hello";
    it(`should get a definition for "${validWord}" (length >= 1)`, async () => {
        const result = await urbanDictionary.define(validWord);
        assert.ok(result && result.length > 0);
    });

    const invalidWord = "￼";
    it(`should NOT get a definition for "${invalidWord}"`, async () => {
        const result = await urbanDictionary.define(invalidWord);
        assert.equal(result, null);
    });

});

describe("Urban dictionary Autocomplete", async () => {
    const validWord = "hello";
    it(`should get autocomplete results for "${validWord}" (length >= 1)`, async () => {
        const result = await urbanDictionary.autoComplete(validWord);
        assert.ok(result && result.length > 0);
    });

    const invalidWord = "￼";
    it(`should NOT get autocomplete results for "${invalidWord}"`, async () => {
        const result = await urbanDictionary.autoComplete(invalidWord);
        assert.equal(result, null);
    });

});