import { describe, expect, it } from "bun:test";
import { urbanDictionary } from "@riskybot/apis";

describe("Urban dictionary Define", async () => {
    const validWord = "hello";
    it(`should get a definition for "${validWord}" (length >= 1)`, async () => {
        const result = await urbanDictionary.define(validWord);
        expect(result).toBeTruthy();
        expect(result?.length).toBeGreaterThan(0);
    });

    const invalidWord = "￼";
    it(`should NOT get a definition for "${invalidWord}"`, async () => {
        const result = await urbanDictionary.define(invalidWord);
        expect(result).toBeNull();
    });

});

describe("Urban dictionary Autocomplete", async () => {
    const validWord = "hello";
    it(`should get autocomplete results for "${validWord}" (length >= 1)`, async () => {
        const result = await urbanDictionary.autoComplete(validWord);
        expect(result).toBeTruthy();
        expect(result?.length).toBeGreaterThanOrEqual(1);
    });

    const invalidWord = "￼";
    it(`should NOT get autocomplete results for "${invalidWord}"`, async () => {
        const result = await urbanDictionary.autoComplete(invalidWord);
        expect(result).toBeNull();
    });

});
