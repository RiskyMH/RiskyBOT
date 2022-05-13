import fetch from "node-fetch";

const urbanBaseURL = "https://api.urbandictionary.com/v0/";

export async function rawDefine(term: string): Promise<RawDefineResult|null> {
    let rawResult = await fetch(urbanBaseURL + "define?" + new URLSearchParams({ term })).catch(null);

    if (!rawResult || rawResult.status !== 200) {
        return null;
    }

    let result: RawDefineResult = await rawResult.json() as RawDefineResult;

    if (!result.list.length) {
        return null;
    }

    return result;
}

export async function rawAutoComplete(term: string): Promise<RawAutoCompleteResult|null> {
    let rawResult = await fetch(urbanBaseURL + "autocomplete?" + new URLSearchParams({ term })).catch(null);
    
    if (!rawResult || rawResult.status !== 200) {
        return null;
    }

    let result: RawAutoCompleteResult = await rawResult.json() as RawAutoCompleteResult;

    if (!result.length) {
         return null;
    }

    return result;
}

/** Always returns a list of strings - null if error or no results */
export async function define(term: string): Promise<DefineResult|null> {
    let result: RawDefineResult | null;
    try{
        result = await rawDefine(term);
    } catch (e) {console.warn(e); return null;}

    if (!result || !result.list) {
        return null;
    }

    let safeResult: DefineResult = [];

    for (let res of result.list){
        try{
            let safeDefinition: DefineResult[0] = {} as DefineResult[0];

            safeDefinition.definition = String(res?.definition || "");
            safeDefinition.permalink = String(res?.permalink || "");
            safeDefinition.thumbs_up = Number(res?.thumbs_up || 0);
            for (let url of res?.sound_url||[]){
                safeDefinition.sound_url.push(String(url||""));
            }
            safeDefinition.author = String(res?.author || "");
            safeDefinition.word = String(res?.word || "");
            safeDefinition.defid = Number(res?.defid || 0);
            safeDefinition.current_vote = String(res?.current_vote || "");
            safeDefinition.written_on = new Date(res?.written_on || new Date().toString());
            safeDefinition.example = String(res?.example || "");
            safeDefinition.thumbs_down = Number(res?.thumbs_down || 0);

            safeResult.push(safeDefinition);
        } catch {return null;}

    }

    return safeResult;
}

/** Always returns a list of strings - list of none if error or no results */
export async function autoComplete(term: string): Promise<AutoCompleteResult|null> {
    let result = await rawAutoComplete(term);

    if (!result || !result.length) {
        return null;
    }

    let safeResult: AutoCompleteResult = [];

    for (let res of result){
        try{
            safeResult.push(String(res));
        } catch {return null;}

    }

    return safeResult;
}

/** These are from the api docs - they might not all exist */
type RawDefineResult = {
    list: {
        definition: string;
        permalink: `http${""|"s"}://${string}.urbanup.com/${number}`
        thumbs_up: number;
        sound_url: string[];
        author: string;
        word: string;
        defid: number;
        current_vote: string;
        written_on: string
        example: string;
        thumbs_down: number;
    }[] | []
}
type DefineResult = {
    definition: string;
    permalink: string| `http${""|"s"}://${string}.urbanup.com/${number}`
    thumbs_up: number;
    sound_url: string[];
    author: string;
    word: string;
    defid: number;
    current_vote: string;
    written_on: Date
    example: string;
    thumbs_down: number;
}[]

/** These are from the api docs - they might not all exist */
type RawAutoCompleteResult = string[]
/** a list of strings */
type AutoCompleteResult = string[]
