import { describe, expect, it } from "bun:test";
import { topgg } from "@riskybot/apis";
import { RiskyBotError } from "@riskybot/error";

describe("Top.gg bot info", async () => {
    const validId = "780657028695326720";
    it("should NOT be happy because no token", async () => {
        try {
            // Should error out
            await topgg.botInfo(validId, "token");
            expect().fail("Should have errored out");
        } catch (error) {
            if (error instanceof RiskyBotError) {
                expect(error).toBeInstanceOf(RiskyBotError);
            } else {
                // Wasn't a RiskyBotError
                throw error;
            }
        }
    });

    // SOMETIME TODO: Add a valid token and add tests for it

});
