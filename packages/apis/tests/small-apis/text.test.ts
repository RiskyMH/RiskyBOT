import { describe, it, expect,  } from "bun:test";
import { smallApis } from "@riskybot/apis";

describe("Text APIs", async () => {

    const word = "hello";
    it(`should provide a rhyme for ${word}`, async () => {
        const result = await smallApis.getRhymes(word);
        expect(result).toBeTruthy();
    });

});
