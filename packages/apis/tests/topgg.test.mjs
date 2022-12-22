import { describe, it } from "node:test";
import assert from "node:assert";
import { topgg } from "../dist/index.mjs";

// TODO: Add more tests

describe("Top.gg bot info", async () => {
    const validId = "780657028695326720";
    it("should NOT be happy because no token", async () => {
        const result = await topgg.botInfo(validId, "token");
        assert.ok(!result);
    });

    // SOMETIME TODO: Add a valid token and add tests for it


});
