import { parseAPI } from "../global.ts";
import { object, string, number, transform } from "valibot";


// https://icanhazdadjoke.com
export const randomDadJoke = () =>
    parseAPI("https://icanhazdadjoke.com", RandomDadJokeResultSchema, randomDadJokeError);

const randomDadJokeError = {
    title: "Error with getting a dad joke",
    message: "An unknown error occurred with [icanhazdadjoke](https://icanhazdadjoke.com)",
};

const RandomDadJokeResultSchema = object({
    id: string(),
    joke: string(),
    status: number(),
});


// https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json
export const randomQuote = () =>
    parseAPI("https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json", RandomQuoteResultSchema, randomQuoteError);

const randomQuoteError = {
    title: "Error with getting a quote",
    message: "An unknown error occurred with [Forismatic](https://forismatic.com/en/)",
};

const RandomQuoteResultSchema = object({
    quoteText: string(),
    quoteAuthor: string(),
    senderName: string(),
    senderLink: string(),
    quoteLink: string(),
});


// https://www.affirmations.dev
export const randomAffirmation = () =>
    parseAPI("https://www.affirmations.dev", RandomAffirmationResult, randomAffirmationError);

const randomAffirmationError = {
    title: "Error with getting an affirmation",
    message: "An unknown error occurred with [Affirmations.dev](https://www.affirmations.dev)",
};

const RandomAffirmationResult = object({
    affirmation: string(),
});


// https://evilinsult.com/generate_insult.php?lang=en&type=json
export const randomInsult = () =>
    parseAPI("https://evilinsult.com/generate_insult.php?lang=en&type=json", RandomInsultResultSchema, randomInsultError);

const randomInsultError = {
    title: "Error with getting an insult",
    message: "An unknown error occurred with [Evil Insult Generator](https://evilinsult.com/)",
};

const RandomInsultResultSchema = object({
    number: transform(string(), num => Number.parseInt(num)),
    language: string(),
    insult: string(),
    created: transform(string(), d => new Date(d)),
    shown: transform(string(), num => Number.parseInt(num)),
    createdby: string(),
    active: transform(string(), num => Number.parseInt(num)),
    comment: string(),
});


// https://uselessfacts.jsph.pl/api/v2/facts/random?language=en
export const randomFact = () =>
    parseAPI("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en", RandomFactResultSchema, randomFactError);

const randomFactError = {
    title: "Error with getting a fact",
    message: "An unknown error occurred with [Useless Facts](https://uselessfacts.jsph.pl/)",
};

const RandomFactResultSchema = object({
    id: string(),
    text: string(),
    source: string(),
    source_url: string(),
    language: string(),
    permalink: string(),
});
