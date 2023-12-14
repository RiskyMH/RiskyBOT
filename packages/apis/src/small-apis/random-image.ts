import { APIError } from "../global.ts";
import { s } from "@sapphire/shapeshift";

// https://api.thecatapi.com/v1/images/search
export async function randomCat() {
    const result = await fetch("https://api.thecatapi.com/v1/images/search");

    if (!result.ok) {
        throw new APIError(randomCatError, result, await result.text());
    }

    const cat = await result.json();

    const verify = randomCatResult.run(cat);
    if (verify.isErr() || !verify.value) {
        throw new APIError(randomCatError, result, JSON.stringify(verify.error, null, 2));
    }

    return verify.value[0];
}
const randomCatError = {
    title: "Error with getting a cat",
    message: "An unknown error occurred with [The Cat API](https://thecatapi.com/)",
};

const randomCatResult = s.object({
    id: s.string,
    url: s.string,
    width: s.number,
    height: s.number,
}).array;


// https://random-d.uk/api/v2/quack
export async function randomDuck() {
    const result = await fetch("https://random-d.uk/api/v2/quack");

    if (!result.ok) {
        throw new APIError(randomDuckError, result, await result.text());
    }

    const duck = await result.json();

    const verify = randomDuckResult.run(duck);
    if (verify.isErr() || !verify.value) {
        throw new APIError(randomDuckError, result, JSON.stringify(verify.error, null, 2));
    }

    return verify.value;

}

const randomDuckError = {
    title: "Error with getting a duck",
    message: "An unknown error occurred with [Random Duck API](https://random-d.uk/)",
};

const randomDuckResult = s.object({
    url: s.string,
    message: s.string,
});


// https://dog.ceo/api/breeds/image/random
export async function randomDog() {
    const result = await fetch("https://dog.ceo/api/breeds/image/random");

    if (!result.ok) {
        throw new APIError(randomDogError, result, await result.text());
    }

    const dog = await result.json();

    const verify = randomDogResult.run(dog);
    if (verify.isErr() || !verify.value) {
        throw new APIError(randomDogError, result, JSON.stringify(verify.error, null, 2));
    }

    return verify.value;
}

const randomDogError = {
    title: "Error with getting a dog",
    message: "An unknown error occurred with [Dog API](https://dog.ceo/)",
};

const randomDogResult = s.object({
    message: s.string,
    status: s.string,
});


// https://shibe.online/api/birds?count=1
export async function randomBird() {
    const result = await fetch("https://shibe.online/api/birds?count=1");

    if (!result.ok) {
        throw new APIError(randomBirdError, result, await result.text());
    }

    const bird = await result.json();

    const verify = randomBirdResult.run(bird);
    if (verify.isErr() || !verify.value) {
        throw new APIError(randomBirdError, result, JSON.stringify(verify.error, null, 2));
    }

    return verify.value[0];
}

const randomBirdError = {
    title: "Error with getting a bird",
    message: "An unknown error occurred with [Shibe Online API](https://shibe.online/)",
};

const randomBirdResult = s.string.array;
