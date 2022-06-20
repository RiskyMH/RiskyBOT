import {fetch} from "undici";

const someRandomApiBaseURL = "https://some-random-api.ml/";


export async function rawLyrics(songTitle: string): Promise<RawLyricsResult|null|undefined> {
    const rawResult = await fetch(someRandomApiBaseURL + "lyrics?" + new URLSearchParams({ title: songTitle }));

    if (rawResult.status === 404) {
        return null;
    } else if (!rawResult || rawResult.status !== 200) {
     return undefined;
    }

    const result: RawLyricsResult = (await rawResult.json()) as RawLyricsResult;

    if (!result) {
        return null;
    }

    return result;
}

export async function getLyrics(songTitle: string): Promise<LyricsResult|null|undefined> {
    let result: RawLyricsResult | null | undefined;
    try{
        result = await rawLyrics(songTitle);
    } catch (e) {console.warn(e); return undefined;}

    if (!result) {
        if (result === null) return null;
        else if (result === undefined) return undefined;
        else return null;
    }

    const safeResult: LyricsResult = {} as LyricsResult;

    try{
        safeResult.lyrics = String(result?.lyrics || "");
        safeResult.author = String(result?.author || "");
        safeResult.title = String(result?.title || "");
        safeResult.thumbnail = {};
        safeResult.thumbnail.genius = result?.thumbnail?.genius ? String(result?.thumbnail?.genius) : undefined;
        safeResult.links = {};
        safeResult.links.genius = result?.links?.genius ? String(result?.links?.genius) : undefined;
        safeResult.disclaimer = result?.disclaimer ? String(result?.disclaimer) : undefined;

    } catch (e) {console.warn(e); return null;}

    return safeResult;
}



export interface RawLyricsResult {
    title: string;
    author: string;
    lyrics: string;
    thumbnail?: {
        genius?: string;
    };
    links?: {
        genius?: string;
    };
    disclaimer?: string;
}

export interface LyricsResult {
    title: string;
    author: string;
    lyrics: string;
    thumbnail: {
        genius?: string;
    };
    links: {
        genius?: string;
    };
    disclaimer?: string;
}