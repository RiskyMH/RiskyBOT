import fetch from "node-fetch";

const urbanBaseURL = "https://api.urbandictionary.com/v0/";

export async function rawDefine(term: string): Promise<RawDefineResult> {
    let result: RawDefineResult = await fetch(urbanBaseURL + "define?" + new URLSearchParams({ term })).then((response) => response.json()) as RawDefineResult;

    if (!result.list.length) {
        console.log("Can't find term");
    }

    return result;
}

export async function rawAutoComplete(term: string): Promise<RawAutoCompleteResult> {
    let result: RawAutoCompleteResult = await fetch(urbanBaseURL + "autocomplete?" + new URLSearchParams({ term })).then((response) => response.json()) as RawAutoCompleteResult;

    if (!result.length) {
         console.log("Cant find term");
    }

    return result;
}

/** Always returns a list of strings - list of none if error or no results */
export async function define(term: string): Promise<DefineResult> {
    let result: RawDefineResult;
    
    try{
        result = await rawDefine(term);
        console.log(result);
    } catch(e){ console.log(e); return [];}

    if (!result || !result?.list) {
        return [];
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
        } catch {continue;}

    }

    return safeResult;
}

/** Always returns a list of strings - list of none if error or no results */
export async function autoComplete(term: string): Promise<AutoCompleteResult> {
    let result: RawAutoCompleteResult;

    try{
        result = await rawAutoComplete(term);
    } catch(e){ return [];}

    if (!result.length) {
        return [];
    }

    let safeResult: AutoCompleteResult = [];

    for (let res of result){
        try{
            safeResult.push(String(res));
        } catch {continue;}

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
/** Always returns a list of strings - list of none if error or no results */
type AutoCompleteResult = string[]
