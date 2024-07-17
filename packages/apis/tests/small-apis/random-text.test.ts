
import { describe, expect, it } from "bun:test";
import { smallApis } from "@riskybot/apis";


describe("Random text", async () => {
    it("should provide a dad joke", async () => {
        const result = await smallApis.randomDadJoke();
        expect(result).toBeTruthy();
    });

    it("should provide a random quote", async () => {
        const result = await smallApis.randomQuote();
        expect(result).toBeTruthy();
    });

    it("should provide a random affirmation", async () => {
        const result = await smallApis.randomAffirmation();
        expect(result).toBeTruthy();
    });

    it("should provide a random insult", async () => {
        const result = await smallApis.randomInsult();
        expect(result).toBeTruthy();
    });

    it("should provide a random fact", async () => {
        const result = await smallApis.randomFact();
        expect(result).toBeTruthy();
    });

});
