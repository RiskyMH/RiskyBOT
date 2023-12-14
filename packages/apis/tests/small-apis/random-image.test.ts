
import { describe, expect, it } from "bun:test";
import { smallApis } from "@riskybot/apis";

describe("Random images", async () => {
    it("should provide a random cat", async () => {
        const result = await smallApis.randomCat();
        expect(result).toBeTruthy();
    });

    it("should provide a random duck", async () => {
        const result = await smallApis.randomDuck();
        expect(result).toBeTruthy();
    });

    it("should provide a random dog", async () => {
        const result = await smallApis.randomDog();
        expect(result).toBeTruthy();
    });

    it("should provide a random bird", async () => {
        const result = await smallApis.randomBird();
        expect(result).toBeTruthy();
    });

});
