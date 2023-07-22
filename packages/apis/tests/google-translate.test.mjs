
import { describe, it } from "node:test";
import assert from "node:assert";
import { googleTranslate } from "../dist/index.mjs";

describe("Google translate", async () => {
    const validText = "Hello!";
    const validLanguage = "en";
    it(`should translate "${validText}" to language "${validLanguage}"`, async () => {
        const result = await googleTranslate.translate(validText, validLanguage);
        assert.ok(result);
    });

});
