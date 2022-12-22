import assert from "node:assert";
import { describe, it } from "node:test";
import { Config } from "../dist/index.mjs";
import path from "path";

// TODO: Add more tests

describe("Config", async () => {

    const rawLocation = path.join(process.cwd(), "../../" ,"config.yml");

    it("should make config from location", async () => {
        const config = new Config(rawLocation, true);
        assert.ok(config);
    });

    /** @type {import("../dist/index.d").ConfigType} */
    const rawData = {
        apiEnabled: {
            googleTranslate: randomBool(),
            nekobot: randomBool(),
            randomSmallOnes: {
                randomImage: randomBool(),
                randomText: randomBool(),
            },
            urbanDictionary: randomBool(),
            reddit: randomBool(),
            someRandomApi: randomBool(),
            topgg: randomBool(),
        },
        colors: {
            error: randomHex(),
            good: randomHex(),
            ok: randomHex(),
            warning: randomHex(),
            washedOut: {
                ok: randomHex(),
            }
        }
    };

    it("should accept raw input", async () => {
        const config = new Config(rawData);
        assert.ok(config);
        assert.equal(config.colors.ok, rawData.colors.ok);
        assert.equal(config.apiEnabled.reddit, rawData.apiEnabled.reddit);
        
    });

});


function randomBool() {
    return Math.random() >= 0.5;
}

/**
 * @returns {`#${string}` }
 */
function randomHex() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}