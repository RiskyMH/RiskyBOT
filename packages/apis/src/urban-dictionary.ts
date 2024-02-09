import { APIError } from "./global.ts";
import { LRUCache } from "lru-cache";
import { type Output, object, string, number, transform, array, url, optional, safeParse } from "valibot";

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

    const parsed = safeParse(DefinitionResultSchema, definition);

    if (!parsed.success || parsed.issues) {
        throw new APIError(genericUrbanError, result, JSON.stringify(parsed.issues, null, 2));
    }

    defineCache.set(searchParams.toString(), parsed.output.list);
    return parsed.output.list;
}

// Queries stay queried for 1 hour
const autoCompleteCache = new LRUCache<string, AutoComplete>({ max: 500, ttl: 1000 * 60 * 60 });

export async function autoComplete(term: string, cache = true): Promise<AutoComplete> {
    if (cache) {
        const cached = autoCompleteCache.get(term);
        if (cached) {
            return cached;
        }
    }

    const searchParams = new URLSearchParams({ term });
    const result = await fetch(`${urbanBaseURL}/autocomplete?${searchParams}`);

    if (!result.ok) {
        throw new APIError(genericUrbanError, result, await result.text());
    }
    const words = await result.json() as RawAutoCompleteResult;

    const parsed = safeParse(AutoCompleteResultSchema, words);

    if (!parsed.success || parsed.issues) {
        throw new APIError(genericUrbanError, result, JSON.stringify(parsed.issues, null, 2));
    }

    autoCompleteCache.set(term, parsed.output);
    return parsed.output;
}

const DefinitionSchema = object({
    definition: string(),
    permalink: string(undefined, [url()]),
    thumbs_up: number(),
    sound_url: optional(array(string())),
    author: string(),
    word: string(),
    defid: number(),
    current_vote: string(),
    written_on: transform(string(), s => new Date(s)),
    example: string(),
    thumbs_down: number()
});

/** These are from the api docs - they might not all exist */
const DefinitionResultSchema = object({
    list: array(DefinitionSchema)
});

type RawDefineResult = Output<typeof DefinitionResultSchema>;
export type Definition = Output<typeof DefinitionSchema>[];

/** These are from the api docs - they might not all exist */
const AutoCompleteResultSchema = array(string());

type RawAutoCompleteResult = string[];
export type AutoComplete = string[];
