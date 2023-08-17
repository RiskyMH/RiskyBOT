import { describe, it } from "node:test";
import assert from "node:assert";
import { topgg } from "../dist/index.mjs";
import { RiskyBotError } from "@riskybot/error";

describe("Top.gg bot info", async () => {
    const validId = "780657028695326720";
    it("should NOT be happy because no token", async () => {
        try {
            // Should error out
            await topgg.botInfo(validId, "token");
            assert.ok(false);
        } catch (error) {
            if (error instanceof RiskyBotError) {
                assert.ok(true);
            } else {
                // Wasn't a RiskyBotError
                throw error;
            }
        }
    });

    // SOMETIME TODO: Add a valid token and add tests for it

});
