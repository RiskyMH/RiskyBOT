import { parseAPI } from "../global.ts";
import { LRUCache } from "lru-cache";
import { type Output, object, string, number, transform, array } from "valibot";

const rhymeCache = new LRUCache<string, Output<typeof RhymeResultSchema>>({ max: 100, ttl: 1000 * 60 * 60 });

// https://rhymebrain.com/talk?function=getRhymes&maxResults=10&word=word
export async function getRhymes(word: string, cache = true) {
    if (cache) {
        const cached = rhymeCache.get(word);
        if (cached) {
            return cached;
        }
    }

    const queryParams = new URLSearchParams({ function: "getRhymes", maxResults: "10", word });
    const rhymes = await parseAPI(`https://rhymebrain.com/talk?${queryParams}`, RhymeResultSchema, rhymeError);

    rhymeCache.set(word, rhymes);
    return rhymes;
}

const rhymeError = {
    title: "Error with getting rhymes",
    message: "An unknown error occurred with [RhymeBrain](https://rhymebrain.com/)",
};

const RhymeResultSchema = array(object({
    word: string(),
    freq: number(),
    score: number(),
    flags: string(),
    syllables: transform(string(), num => Number.parseInt(num)),
}));
