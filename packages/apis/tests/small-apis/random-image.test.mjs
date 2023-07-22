
import { describe, it } from "node:test";
import assert from "node:assert";
import { smallApis } from "../../dist/index.mjs";

describe("Random images", async () => {
    it("should provide a random cat", async () => {
        const result = await smallApis.randomCat();
        assert.ok(result);
    });

    it("should provide a random duck", async () => {
        const result = await smallApis.randomDuck();
        assert.ok(result);
    });

    it("should provide a random dog", async () => {
        const result = await smallApis.randomDog();
        assert.ok(result);
    });

    it("should provide a random bird", async () => {
        const result = await smallApis.randomBird();
        assert.ok(result);
    });

});
