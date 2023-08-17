import { InferType, s } from "@sapphire/shapeshift";
import { fetch } from "undici";
import { APIError } from "./global.mjs";
import { LRUCache } from "lru-cache";

const urbanBaseURL = "https://api.urbandictionary.com/v0";

const urbanAuthor = {
    name: "Urban Dictionary",
    url: "https://urbandictionary.com",
    image: "https://www.urbandictionary.com/apple-touch-icon.png",
};

const genericUrbanError = {
    author: urbanAuthor,
    title: "Error with Urban Dictionary",
    message: "An unknown error occurred with [Urban Dictionary API](https://urbandictionary.com/)",
};

const defineCache = new LRUCache<string, Definition>({ max: 100, ttl: 1000 * 60 * 60 });

export async function define(term: string, cache = true): Promise<Definition | null> {
    const searchParams = new URLSearchParams({ term });
    if (cache) {
        const cached = defineCache.get(searchParams.toString());
        if (cached) {
            return cached;
        }
    }

    const result = await fetch(`${urbanBaseURL}/define?${searchParams}`);

    if (result.status === 404) {
        // No error because it's a 404
        return null;
    } else if (!result.ok) {
        throw new APIError(genericUrbanError, result, await result.text());
    }
    const definition = await result.json() as RawDefineResult;

    if (definition.list.length === 0) {
        return null;
    }

    const verify = rawDefineResult.run(definition);
    if (verify.isErr() || !verify.value) {
        throw new APIError(genericUrbanError, result, JSON.stringify(verify.error, null, 2));
    }

    defineCache.set(searchParams.toString(), verify.value.list);
    return verify.value.list;
}

// Queries stay queried for 1 hour
const autoCompleteCache = new LRUCache<string, AutoComplete>({ max: 500, ttl: 1000 * 60 * 60 });

export async function autoComplete(term: string, cache = true): Promise<AutoComplete | null | undefined> {
    if (cache) {
        const cached = autoCompleteCache.get(term);
        if (cached) {
            return cached;
        }
    }

    const searchParams = new URLSearchParams({ term });
    const result = await fetch(`${urbanBaseURL}/autocomplete?${searchParams}`);

    if (result.status === 404) {
        // No error because it's a 404
        return null;
    } else if (!result.ok) {
        throw new APIError(genericUrbanError, result, await result.text());
    }
    const definition = await result.json() as RawAutoCompleteResult;

    if (!definition || definition.length === 0) {
        return null;
    }

    const verify = rawAutoCompleteResult.run(definition);
    if (verify.isErr() || !verify.value) {
        throw new APIError(genericUrbanError, result, JSON.stringify(verify.error, null, 2));
    }

    autoCompleteCache.set(term, verify.value);
    return verify.value;
}

const definition = s.object({
    definition: s.string,
    permalink: s.string.url(),
    thumbs_up: s.number,
    sound_url: s.string.array.optional,
    author: s.string,
    word: s.string,
    defid: s.number,
    current_vote: s.string,
    written_on: s.string.transform((s) => new Date(s)),
    example: s.string,
    thumbs_down: s.number
});

/** These are from the api docs - they might not all exist */
const rawDefineResult = s.object({
    list: definition.array
});

type RawDefineResult = InferType<typeof rawDefineResult>;
export type Definition = InferType<typeof definition>[];

/** These are from the api docs - they might not all exist */
const rawAutoCompleteResult = s.string.array;

type RawAutoCompleteResult = string[];
export type AutoComplete = string[];
