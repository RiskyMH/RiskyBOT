import assert from "node:assert";
import { describe, it } from "node:test";
import { affect } from "../dist/index.mjs";

// TODO: Add more tests :)
// TODO: Get nodejs tests to not crash when using `@napi-rs/canvas`

describe("Affect", async () => {

    const imgUrl = "https://picsum.photos/512";
    it("should make an image with", async () => {
        const img = await affect({imgLink: imgUrl});
        assert.ok(img);
    });

});