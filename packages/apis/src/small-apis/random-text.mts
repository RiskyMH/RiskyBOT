import { fetch } from "undici";
import { APIError, jsonHeaders } from "../global.mjs";
import { s } from "@sapphire/shapeshift";


// https://icanhazdadjoke.com
export async function randomDadJoke() {
    const result = await fetch("https://icanhazdadjoke.com", jsonHeaders);

    if (!result.ok) {
        throw new APIError(randomDadJokeError, result, await result.text());
    }

    const joke = await result.json();
    
    const verify = randomDadJokeResult.run(joke);
    if (verify.isErr() || !verify.value) {
        throw new APIError(randomDadJokeError, result, JSON.stringify(verify.error, null, 2));
    }

    return verify.value;
}

const randomDadJokeError = {
    title: "Error with getting a dad joke",
    message: "An unknown error occurred with [icanhazdadjoke](https://icanhazdadjoke.com)",
};

const randomDadJokeResult = s.object({
    id: s.string,
    joke: s.string,
    status: s.number,
});


// https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json
export async function randomQuote() {
    const result = await fetch("https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json");

    if (!result.ok) {
        throw new APIError(randomQuoteError, result, await result.text());
    }

    const quote = await result.json();

    const verify = randomQuoteResult.run(quote);
    if (verify.isErr() || !verify.value) {
        throw new APIError(randomQuoteError, result, JSON.stringify(verify.error, null, 2));
    }

    return verify.value;
}

const randomQuoteError = {
    title: "Error with getting a quote",
    message: "An unknown error occurred with [Forismatic](https://forismatic.com/en/)",
};

const randomQuoteResult = s.object({
    quoteText: s.string,
    quoteAuthor: s.string,
    senderName: s.string,
    senderLink: s.string,
    quoteLink: s.string,
});


// https://www.affirmations.dev
export async function randomAffirmation() {
    const result = await fetch("https://www.affirmations.dev", jsonHeaders);

    if (!result.ok) {
        throw new APIError(randomAffirmationError, result, await result.text());
    }

    const affirmation = await result.json();

    const verify = randomAffirmationResult.run(affirmation);
    if (verify.isErr() || !verify.value) {
        throw new APIError(randomAffirmationError, result, JSON.stringify(verify.error, null, 2));
    }

    return verify.value;
}

const randomAffirmationError = {
    title: "Error with getting an affirmation",
    message: "An unknown error occurred with [Affirmations.dev](https://www.affirmations.dev)",
};

const randomAffirmationResult = s.object({
    affirmation: s.string,
});


// https://evilinsult.com/generate_insult.php?lang=en&type=json
export async function randomInsult() {
    const result = await fetch("https://evilinsult.com/generate_insult.php?lang=en&type=json");

    if (!result.ok) {
        throw new APIError(randomInsultError, result, await result.text());
    }

    const insult = await result.json();

    const verify = randomInsultResult.run(insult);
    if (verify.isErr() || !verify.value) {
        throw new APIError(randomInsultError, result, JSON.stringify(verify.error, null, 2));
    }

    return verify.value;
}

const randomInsultError = {
    title: "Error with getting an insult",
    message: "An unknown error occurred with [Evil Insult Generator](https://evilinsult.com/)",
};

const randomInsultResult = s.object({
    number: s.string.transform(num => parseInt(num)),
    language: s.string,
    insult: s.string,
    created: s.string.transform(d => new Date(d)),
    shown: s.string.transform(num => parseInt(num)),
    createdby: s.string,
    active: s.string.transform(num => parseInt(num)),
    comment: s.string,
});

    
// https://uselessfacts.jsph.pl/api/v2/facts/random?language=en
export async function randomFact() {
    const result = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en", jsonHeaders);

    if (!result.ok) {
        throw new APIError(randomFactError, result, await result.text());
    }

    const fact = await result.json();

    const verify = randomFactResult.run(fact);
    if (verify.isErr() || !verify.value) {
        throw new APIError(randomFactError, result, JSON.stringify(verify.error, null, 2));
    }

    return verify.value;
}

const randomFactError = {
    title: "Error with getting a fact",
    message: "An unknown error occurred with [Useless Facts](https://uselessfacts.jsph.pl/)",
};

const randomFactResult = s.object({
    id: s.string,
    text: s.string,
    source: s.string,
    source_url: s.string,
    language: s.string,
    permalink: s.string,
});

