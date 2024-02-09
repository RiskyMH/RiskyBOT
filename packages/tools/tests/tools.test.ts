import { describe, it, expect } from "bun:test";
import { resolveColor, resolveHexColor, trim } from "@riskybot/tools";


describe("Trim", async () => {

    // should not trim (5 char import and 10 char max)
    it("should not trim", async () => {
        const string = "12345";
        const expected = "12345";
        const max = 10;
        const result = trim(string, max);
        expect(result).toBe(expected);
    });

    // should trim (5 char import and 4 char max)
    it("should trim", async () => {
        const string = "12345";
        const expected = "123…";
        const max = 4;
        const result = trim(string, max);
        expect(result).toBe(expected);
    });

});


describe("Resolve Color", async () => {

    // should work (#1A2B3C = 0x1A2B3C)
    it("should work", async () => {
        const string = "#1A2B3C";
        const expected = 0x1A_2B_3C;
        const result = resolveColor(string);
        expect(result).toBe(expected);
    });

});

describe("Resolve Color (inverse)", async () => {

    // should work (0x1A2B3C = #1a2b3c)
    it("should work", async () => {
        const string = 0x1A_2B_3C;
        const expected = "#1a2b3c";
        const result = resolveHexColor(string).toLowerCase();
        expect(result).toBe(expected);
    });

}
);