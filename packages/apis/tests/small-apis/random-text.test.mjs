
import { describe, it } from "node:test";
import assert from "node:assert";
import { smallApis } from "../../dist/index.mjs";


describe("Random text", async () => {
    it("should provide a dad joke", async () => {
        const result = await smallApis.randomDadJoke();
        assert.ok(result);
    });

    it("should provide a random quote", async () => {
        const result = await smallApis.randomQuote();
        assert.ok(result);
    });

    it("should provide a random affirmation", async () => {
        const result = await smallApis.randomAffirmation();
        assert.ok(result);
    });

    it("should provide a random insult", async () => {
        const result = await smallApis.randomInsult();
        assert.ok(result);
    });

    it("should provide a random fact", async () => {
        const result = await smallApis.randomFact();
        assert.ok(result);
    });

});
