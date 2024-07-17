import { parseAPI } from "../global.ts";
import { object, string, number, transform, array } from "valibot";


// https://api.thecatapi.com/v1/images/search
export const randomCat = () =>
    parseAPI("https://api.thecatapi.com/v1/images/search", RandomCatResultSchema, randomCatError);

const randomCatError = {
    title: "Error with getting a cat",
    message: "An unknown error occurred with [The Cat API](https://thecatapi.com/)",
};

const RandomCatResultSchema = transform(array(object({
    id: string(),
    url: string(),
    width: number(),
    height: number(),
})), d => d[0]);


// https://random-d.uk/api/v2/quack
export const randomDuck = () =>
    parseAPI("https://random-d.uk/api/v2/quack", RandomDuckResultSchema, randomDuckError);

const randomDuckError = {
    title: "Error with getting a duck",
    message: "An unknown error occurred with [Random Duck API](https://random-d.uk/)",
};

const RandomDuckResultSchema = object({
    url: string(),
    message: string(),
});


// https://dog.ceo/api/breeds/image/random
export const randomDog = () =>
    parseAPI("https://dog.ceo/api/breeds/image/random", RandomDogResultSchema, randomDogError);

const randomDogError = {
    title: "Error with getting a dog",
    message: "An unknown error occurred with [Dog API](https://dog.ceo/)",
};

const RandomDogResultSchema = object({
    message: string(),
    status: string(),
});


// https://shibe.online/api/birds?count=1
export const randomBird = () =>
    parseAPI("https://shibe.online/api/birds?count=1", randomBirdResult, randomBirdError);

const randomBirdError = {
    title: "Error with getting a bird",
    message: "An unknown error occurred with [Shibe Online API](https://shibe.online/)",
};

const randomBirdResult = transform(array(string()), birds => birds[0]);
