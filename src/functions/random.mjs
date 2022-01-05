import { italic } from "@discordjs/builders";
import { MessageEmbed, MessageButton, MessageActionRow } from "discord.js";
import fetch from "node-fetch";
import { getBetweenStr } from "../tools.mjs";
import { reddit, redditAutoComplete } from "./defaults.mjs";
/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").HexColorString} color
 * @param {import("discord.js").HexColorString} colorErr
 * @param {string} type
 * @param {number} num1
 * @param {number} num2
 * @param {string} text1
 * @return {Promise <import("discord.js").InteractionReplyOptions>}
 */

export default async function random(client, color, colorErr, type, num1, num2, text1) {
    let randomEmb = new MessageEmbed();
    let errorEmb = new MessageEmbed()
        .setTitle("Errors - random")
        .setColor(colorErr);
    let row = new MessageActionRow().addComponents(
        new MessageButton()
        .setCustomId("random-again")
        .setLabel("Again")
        .setStyle("PRIMARY")
        .setDisabled(false)
    );
    
    let errors = [];

    switch (type) {
        case "cat":
            row.components[0].setCustomId("random-again-cat");

            if (!errors.length) {
                /** @type Object() */
                let cat = await fetch("https://aws.random.cat/meow").then(response => response.json());

                randomEmb
                    .setTitle("Random - Cat")
                    .setURL("https://aws.random.cat/view")
                    .setAuthor({name: "Random Cat", url: "https://aws.random.cat/view", iconURL: "https://purr.objects-us-east-1.dream.io/static/ico/favicon-96x96.png"})
                    .setColor(color)
                    .setImage(await cat.file);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }

        case "dog":
            row.components[0].setCustomId("random-again-dog");

            if (!errors.length) {
                /** @type Object() */
                let dog = await fetch("https://dog.ceo/api/breeds/image/random").then(response => response.json());

                randomEmb
                    .setTitle("Random - Dog")
                    .setURL("https://dog.ceo/")
                    .setAuthor({name: "Dog Ceo", url: "https://dog.ceo/", iconURL: "https://dog.ceo/img/favicon.png"})
                    .setColor(color)
                    .setImage(await dog.message);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }
        case "kangaroo":
            row.components[0].setCustomId("random-again-kangaroo");

            if (!errors.length) {
                /** @type Object() */
                let kanga = await fetch("https://some-random-api.ml/animal/kangaroo").then(response => response.json());

                randomEmb
                    .setTitle("Random - Kangaroo")
                    .setURL("https://some-random-api.ml")
                    .setAuthor({name: "Some Random Api", url: "https://some-random-api.ml", iconURL: "https://i.some-random-api.ml/logo.png"})
                    .setColor(color)
                    .setImage(await kanga.image);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }

        case "fox":
            row.components[0].setCustomId("random-again-fox");

            if (!errors.length) {
                /** @type Object() */
                let fox = await fetch("https://some-random-api.ml/animal/fox").then(response => response.json());

                randomEmb
                    .setTitle("Random - Fox")
                    .setURL("https://some-random-api.ml")
                    .setAuthor({name: "Some Random Api", url: "https://some-random-api.ml", iconURL: "https://i.some-random-api.ml/logo.png"})
                    .setColor(color)
                    .setImage(await fox.image);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }

        case "panda":
            row.components[0].setCustomId("random-again-panda");

            if (!errors.length) {
                /** @type Object() */
                let panda = await fetch("https://some-random-api.ml/animal/panda").then(response => response.json());

                randomEmb
                    .setTitle("Random - Panda")
                    .setURL("https://some-random-api.ml")
                    .setAuthor({name: "Some Random Api", url: "https://some-random-api.ml", iconURL: "https://i.some-random-api.ml/logo.png"})
                    .setColor(color)
                    .setImage(await panda.image);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }

        case "joke":
            row.components[0].setCustomId("random-again-joke");

            if (!errors.length) {
                /** @type Object() */
                let joke = await fetch("https://some-random-api.ml/joke").then(response => response.json());

                randomEmb
                    .setTitle("Random - Joke")
                    .setURL("https://some-random-api.ml")
                    .setAuthor({name: "Some Random Api", url: "https://some-random-api.ml", iconURL: "https://i.some-random-api.ml/logo.png"})
                    .setColor(color)
                    .setDescription(await joke.joke);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }

        case "quote":
            row.components[0].setCustomId("random-again-quote");

            if (!errors.length) {
                /** @type Object() */
                let quote = await fetch("https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json").then(response => response.json());

                randomEmb
                    .setTitle("Random - Quote")
                    .setURL("https://forismatic.com/en/homepage")
                    .setAuthor({name: "Forismatic", url: "https://forismatic.com/en/", /* iconURL: "https://forismatic.com/favicon.ico"*/})
                    .setColor(color)
                    .setDescription(`"${italic(await quote.quoteText)}" (${await quote.quoteAuthor})`);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }

        case "affirmation":
            row.components[0].setCustomId("random-again-affirmation");

            if (!errors.length) {
                /** @type Object() */
                let quote = await fetch("https://www.affirmations.dev").then(response => response.json());

                randomEmb
                    .setTitle("Random - Affirmation")
                    .setURL("https://www.affirmations.dev")
                    .setAuthor({name: "Affirmations.dev", url: "https://github.com/annthurium/affirmations", /* iconURL: "https://forismatic.com/favicon.ico"*/})
                    .setColor(color)
                    .setDescription(await quote.affirmation);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }

        case "fact":
            row.components[0].setCustomId("random-again-fact");

            if (!errors.length) {
                /** @type Object() */
                let quote = await fetch("https://uselessfacts.jsph.pl/random.json?language=en").then(response => response.json());

                randomEmb
                    .setTitle("Random - Fact")
                    .setURL("https://uselessfacts.jsph.pl/")
                    .setAuthor({name: "Useless Facts", url: "https://uselessfacts.jsph.pl/", /* iconURL: "https://forismatic.com/favicon.ico"*/})
                    .setColor(color)
                    .setDescription(await quote.text)
                    .setFooter({text:"Source: "+await quote.source});
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }
            
        case "koala":
            row.components[0].setCustomId("random-again-koala");

            if (!errors.length) {
                /** @type Object() */
                let kanga = await fetch("https://some-random-api.ml/animal/koala").then(response => response.json());

                randomEmb
                    .setTitle("Random - Koala")
                    .setURL("https://some-random-api.ml")
                    .setAuthor({name: "Some Random Api", url: "https://some-random-api.ml", iconURL: "https://i.some-random-api.ml/logo.png"})
                    .setColor(color)
                    .setImage(await kanga.image);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }
        case "bird":
            row.components[0].setCustomId("random-again-bird");

            if (!errors.length) {
                /** @type Object() */
                let bird = await fetch("https://shibe.online/api/birds?count=1").then(response => response.json());

                randomEmb
                    .setTitle("Random - Bird")
                    .setURL("https://shibe.online/")
                    .setAuthor({name: "Shibe Online", url: "https://shibe.online/", /* iconURL: "https://shibe.online/assets/favicon.ico" */})
                    .setColor(color)
                    .setImage(await bird[0]);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }

        case "duck":
            row.components[0].setCustomId("random-again-duck");

            if (!errors.length) {
                /** @type Object() */
                let duck = await fetch("https://random-d.uk/api/v2/quack").then(response => response.json());

                randomEmb
                    .setTitle("Random - Duck")
                    .setURL("https://random-d.uk/")
                    .setAuthor({name: "random-d.uk", url: "https://random-d.uk/", iconURL: "https://random-d.uk/static/favicon-dark.png"})
                    .setColor(color)
                    .setImage(await duck.url);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }

        case "number": {
            num1 ||= 0;
            num2 ||= 100;
            row.components[0].setCustomId(`random-again-number-(${num1}-${num2})`);
            
            let min = Math.ceil(num1);
            let max = Math.floor(num2);

            randomEmb
                .setTitle(`Random - \`min:${num1} max:${num2}\``)
                .setColor(color)
                .setDescription(`${Math.floor(Math.random() * (max - min) + min).toLocaleString()}`);
            return { embeds: [randomEmb], components: [row] };
            }

        case "random-post": {
                let data = await reddit(client, type, text1, color, colorErr);
            return data;
        }

        }
    
}

/**
 * @param {import("discord.js").Client} client
 * @param {string} input
 * @param { string } engine
 * @return { Promise <import("discord.js").ApplicationCommandOptionChoice[]> }
 */
export async function autoComplete(client, engine, input) {
    try {
        switch (engine) {
            case "random-post": {
                return await redditAutoComplete(client, "sub-reddit", input);
        }
        }
    } catch {console.log;}

}

/**
 * @param {import("discord.js").Client} client
 * @param {import("../types").ConfigJSON} config
 * @param {string} id
 * @returns {Promise< import("discord.js").InteractionReplyOptions>}
 */
export async function button(client, config, id) {
    let num1 = 0;
    let num2 = 0;
    let text1 = "";
    let idActual = id.split("-")[2];
    if (idActual == "number") {
        let nums = await getBetweenStr(id, "(", ")", "-");
        num1 = Number(nums[0]);
        num2 = Number(nums[1]);
    } else if (idActual == "randomPost") {
        text1 = String(await getBetweenStr(id, "(", ")"));
        idActual = "random-post";
    }

    let data = await random(client, config.colors.ok, config.colors.error, idActual, num1, num2, text1);
    return data;
}
