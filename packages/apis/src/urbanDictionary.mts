import { InferType, s } from "@sapphire/shapeshift";
import { fetch } from "undici";

const urbanBaseURL = "https://api.urbandictionary.com/v0/";

export async function rawDefine(term: string): Promise<RawDefineResult|null|undefined> {
    const rawResult = await fetch(urbanBaseURL + "define?" + new URLSearchParams({ term }));
    
    if (rawResult.status === 404) {
        return null;
    } else if (!rawResult.ok) {
        return undefined;
    }

    const result = await rawResult.json() as RawDefineResult;
    
    if (!result.list.length) {
        return null;
    }

    return RawDefineResult.parse(result);
}

export async function rawAutoComplete(term: string): Promise<RawAutoCompleteResult|null|undefined> {
    const rawResult = await fetch(urbanBaseURL + "autocomplete?" + new URLSearchParams({ term }));
    
    if (rawResult.status === 404) {
        return null;
    } else if (!rawResult || rawResult.status !== 200) {
        return undefined;
    }

    const result = await rawResult.json() as RawAutoCompleteResult;

    if (!result.length) {
         return null;
    }

    return RawAutoCompleteResult.parse(result);
}

/** Always returns a list of strings - null if error or no results */
export async function define(term: string): Promise<DefineResult[]|null|undefined> {
    let result: RawDefineResult | null | undefined;
    try{
        result = await rawDefine(term);
    } catch (e) {
        console.warn(e); 
        return undefined;
    }

    if (!result || !result.list) {
        if (result === undefined) return undefined;
        if (result === null) return null;
        return null;
    }

    const newResult: DefineResult[] = [];

    for (const res of result.list) {
        const definition = {} as DefineResult;

        definition.definition = res.definition;
        definition.permalink = res.permalink;
        for (const url of res.sound_url || []) {
            definition.soundUrl.push(url);
        }
        definition.soundUrl ||= [];
        definition.author = res.author;
        definition.word = res.word;
        definition.id = res.defid;
        definition.currentVote = res.current_vote;
        definition.writtenOn = new Date(res.written_on);
        definition.example = res.example;
        definition.thumbsUp = res.thumbs_up;
        definition.thumbsDown = res.thumbs_down;

        newResult.push(definition);
        
    }

    return newResult;
}

/** Always returns a list of strings - list of none if error or no results */
export async function autoComplete(term: string): Promise<AutoCompleteResult|null|undefined> {
    let result: RawAutoCompleteResult | null | undefined;
    try {
        result = await rawAutoComplete(term);
    } catch (e) {
        console.warn(e);
        return undefined;
    }

    if (!result || !result.length) {
        if (result === undefined) return undefined;
        if (result === null) return null;
        return null;
    }

    const safeResult: AutoCompleteResult = [];

    for (const res of result) {
        safeResult.push(res);
    }

    return safeResult;
}

/** These are from the api docs - they might not all exist */
const RawDefineResult = s.object({
    list: s.object({
        /** a */
        definition: s.string,
        permalink: s.string.url(),
        thumbs_up: s.number,
        sound_url: s.string.array.optional,
        author: s.string,
        word: s.string,
        defid: s.number,
        current_vote: s.string,
        written_on: s.string,
        example: s.string,
        thumbs_down: s.number
    }).array
});

type RawDefineResult = InferType<typeof RawDefineResult>;

type DefineResult = {
    definition: string;
    permalink: string | `http${""|"s"}://${string}.urbanup.com/${number}`
    thumbsUp: number;
    soundUrl: string[];
    author: string;
    word: string;
    id: number;
    currentVote: string;
    writtenOn: Date
    example: string;
    thumbsDown: number;
};

/** These are from the api docs - they might not all exist */
const RawAutoCompleteResult = s.string.array;
type RawAutoCompleteResult = string[];

/** a list of strings */
type AutoCompleteResult = string[];
