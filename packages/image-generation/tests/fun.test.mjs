import assert from "node:assert";
import { describe, it } from "node:test";
import { affect, cry } from "../dist/index.mjs";


describe("Affect", async () => {

    it("should make an image with", async () => {
        const imgLink = "https://picsum.photos/512";
        const img = await affect({ imgLink });
        assert.ok(img);
    });

});

describe("Cry", async () => {

    it("should make an image with", async () => {
        const text = "HELLO WORLD";
        const img = await cry({ text });
        assert.ok(img);
    });

});