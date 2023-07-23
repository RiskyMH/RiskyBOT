import { fetch } from "undici";
import { APIError } from "./global.mjs";
import { s } from "@sapphire/shapeshift";
import { LRUCache } from "lru-cache";

const googleTranslateAuthor = {
    name: "Google Translate",
    url: "https://translate.google.com",
    image: "https://www.gstatic.com/images/branding/product/1x/translate_64dp.png",
};

const genericGoogleTranslateError = {
    author: googleTranslateAuthor,
    title: "Error with Google Translate",
    message: "An unknown error occurred with [Google Translate API](https://translate.google.com)",
};

const translateCache = new LRUCache<string, Translation>({ max: 100, ttl: 1000 * 60 * 60 });

export async function translate(content: string, to: string, from: string = "auto", cache = true): Promise<Translation> {
    if (cache) {
        const cached = translateCache.get(`${from}-${to}-${encodeURIComponent(content)}`);
        if (cached) {
            return cached;
        }
    }

    const queryParams = new URLSearchParams({ sl: from, tl: to, q: content });
    const result = await fetch(`https://translate.google.com/translate_a/t?client=dict-chrome-ex&${queryParams}`);

    if (!result.ok) {
        throw new APIError(genericGoogleTranslateError, result, await result.text());
    }

    const data = await result.json() as [[string, string]];

    const verify = rawGoogleTranslateResult.run(data);
    if (verify.isErr() || !verify.value) {
        throw new APIError(genericGoogleTranslateError, result, JSON.stringify(verify.error, null, 2));
    }

    // return verify.value;
    const [[translatedText, language]] = verify.value;

    translateCache.set(`${from}-${to}-${encodeURIComponent(content)}`, { translatedText, language });
    return { translatedText, language };
}

const rawGoogleTranslateResult = s.array(s.array(s.string));

export type Translation = {
    translatedText: string;
    language: string;
};


/**
 *
 * Generated from https://translate.google.com
 *
 * The languages that Google Translate supports (as of 5/15/16) alongside with their ISO 639-1 codes
 * See https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 */
export const langs: Record<string, string> = {
    "auto": "Automatic",
    "af": "Afrikaans",
    "sq": "Albanian",
    "am": "Amharic",
    "ar": "Arabic",
    "hy": "Armenian",
    "az": "Azerbaijani",
    "eu": "Basque",
    "be": "Belarusian",
    "bn": "Bengali",
    "bs": "Bosnian",
    "bg": "Bulgarian",
    "ca": "Catalan",
    "ceb": "Cebuano",
    "ny": "Chichewa",
    "zh": "Chinese (Simplified)",
    "zh-cn": "Chinese (Simplified)",
    "zh-tw": "Chinese (Traditional)",
    "co": "Corsican",
    "hr": "Croatian",
    "cs": "Czech",
    "da": "Danish",
    "nl": "Dutch",
    "en": "English",
    "eo": "Esperanto",
    "et": "Estonian",
    "tl": "Filipino",
    "fi": "Finnish",
    "fr": "French",
    "fy": "Frisian",
    "gl": "Galician",
    "ka": "Georgian",
    "de": "German",
    "el": "Greek",
    "gu": "Gujarati",
    "ht": "Haitian Creole",
    "ha": "Hausa",
    "haw": "Hawaiian",
    "he": "Hebrew",
    "iw": "Hebrew",
    "hi": "Hindi",
    "hmn": "Hmong",
    "hu": "Hungarian",
    "is": "Icelandic",
    "ig": "Igbo",
    "id": "Indonesian",
    "ga": "Irish",
    "it": "Italian",
    "ja": "Japanese",
    "jw": "Javanese",
    "kn": "Kannada",
    "kk": "Kazakh",
    "km": "Khmer",
    "ko": "Korean",
    "ku": "Kurdish (Kurmanji)",
    "ky": "Kyrgyz",
    "lo": "Lao",
    "la": "Latin",
    "lv": "Latvian",
    "lt": "Lithuanian",
    "lb": "Luxembourgish",
    "mk": "Macedonian",
    "mg": "Malagasy",
    "ms": "Malay",
    "ml": "Malayalam",
    "mt": "Maltese",
    "mi": "Maori",
    "mr": "Marathi",
    "mn": "Mongolian",
    "my": "Myanmar (Burmese)",
    "ne": "Nepali",
    "no": "Norwegian",
    "ps": "Pashto",
    "fa": "Persian",
    "pl": "Polish",
    "pt": "Portuguese",
    "pa": "Punjabi",
    "ro": "Romanian",
    "ru": "Russian",
    "sm": "Samoan",
    "gd": "Scots Gaelic",
    "sr": "Serbian",
    "st": "Sesotho",
    "sn": "Shona",
    "sd": "Sindhi",
    "si": "Sinhala",
    "sk": "Slovak",
    "sl": "Slovenian",
    "so": "Somali",
    "es": "Spanish",
    "su": "Sundanese",
    "sw": "Swahili",
    "sv": "Swedish",
    "tg": "Tajik",
    "ta": "Tamil",
    "te": "Telugu",
    "th": "Thai",
    "tr": "Turkish",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "uz": "Uzbek",
    "vi": "Vietnamese",
    "cy": "Welsh",
    "xh": "Xhosa",
    "yi": "Yiddish",
    "yo": "Yoruba",
    "zu": "Zulu"
};