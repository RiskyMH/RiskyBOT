import { s } from "@sapphire/shapeshift";
import { fetch } from "undici";
import { APIError, InferArrayType } from "../global.mjs";
import { LRUCache } from "lru-cache";


const rhymeCache = new LRUCache<string, RhymeResult>({ max: 100, ttl: 1000 * 60 * 60 });

// https://rhymebrain.com/talk?function=getRhymes&maxResults=10&word=word
export async function getRhymes(word: string, cache = true): Promise<RhymeResult> {
    if (cache) {
        const cached = rhymeCache.get(word);
        if (cached) {
            return cached;
        }
    }

    const queryParams = new URLSearchParams({ function: "getRhymes", maxResults: "10", word });
    const result = await fetch(`https://rhymebrain.com/talk?${queryParams}`);

    if (!result.ok) {
        throw new APIError(rhymeError, result, await result.text());
    }

    const rhymes = await result.json() as RhymeResult;

    const verify = rhymeResult.run(rhymes);
    if (verify.isErr() || !verify.value) {
        throw new APIError(rhymeError, result, JSON.stringify(verify.error, null, 2));
    }

    rhymeCache.set(word, rhymes);
    return rhymes;
}

const rhymeError = {
    title: "Error with getting rhymes",
    message: "An unknown error occurred with [RhymeBrain](https://rhymebrain.com/)",
};

const rhymeResult = s.object({
    word: s.string,
    freq: s.number,
    score: s.number,
    flags: s.string,
    syllables: s.string.transform(num => parseInt(num)),
}).array;

type RhymeResult = InferArrayType<typeof rhymeResult>;
