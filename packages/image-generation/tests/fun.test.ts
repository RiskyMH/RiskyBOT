import { describe, it, expect } from "bun:test";
import { affect, cry } from "@riskybot/image-generate";


describe("Affect", async () => {

    it("should make an image with", async () => {
        const imgLink = "https://picsum.photos/512";
        const img = await affect({ imgLink });
        expect(img).toBeTruthy();
    });

});

describe("Cry", async () => {

    it("should make an image with", async () => {
        const text = "HELLO WORLD";
        const img = await cry({ text });
        expect(img).toBeTruthy();
    });

});