import { describe, expect, it } from "bun:test";
import { googleTranslate } from "@riskybot/apis";

describe("Google translate", async () => {
    const validText = "Hello!";
    const validLanguage = "en";
    it(`should translate "${validText}" to language "${validLanguage}"`, async () => {
        const result = await googleTranslate.translate(validText, validLanguage);
        expect(result).toBeTruthy();
    });

});
