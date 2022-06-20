import { inlineCode, italic, EmbedBuilder, ButtonBuilder, ActionRowBuilder, MessageActionRowComponentBuilder, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandNumberOption, SlashCommandSubcommandGroupBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { ButtonStyle } from "discord-api-types/v10";
import { fetch } from "undici";
import { EnvEnabled, getBetweenStr } from "@riskybot/tools";
import { reddit, redditAutoComplete } from "./index.mjs";
import type { ApplicationCommandOptionChoiceData, InteractionReplyOptions } from "discord.js";
import type { Config } from "@riskybot/tools";


//TODO: Make sure everything works...
//TODO: Migrate the fetch into `@riskybot/apis`


export default async function random(config: Config, type: string, input: {num1?: number, num2?: number, text1?: string} = {num1: undefined, num2: undefined, text1: undefined }, userId?: string): Promise<InteractionReplyOptions> {
    let randomEmb = new EmbedBuilder();
    let errorEmb = new EmbedBuilder()
        .setTitle("Errors - random")
        .setColor(config.getColors().error);
    let row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([
        new ButtonBuilder()
        .setCustomId(`random-again${userId? "-" + userId: ""}`)
        .setLabel("Another?")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(false)
    ]);
    let messageContent = "";
    
    let errors: string[] = [];

    switch (type) {
        case "cat": {
            row.components[0].setCustomId(`random-again-cat${userId? "-" + userId: ""}`);

            let cat: any = await fetch("https://aws.random.cat/meow").then(response => response.json()) as object;

            randomEmb
                .setTitle("🐱 Cat")
                .setURL("https://aws.random.cat/view")
                .setFooter({text: "Powered by https://aws.random.cat"})
                .setColor(config.getColors().washedOut.ok)
                .setImage(await cat.file);
            messageContent = "Here is your random cat";
            return { embeds: [randomEmb], components: [row], content: messageContent };
        }

        case "dog":
            row.components[0].setCustomId(`random-again-dog${userId? "-" + userId: ""}`);

            if (!errors.length) {
                let dog: any = await fetch("https://dog.ceo/api/breeds/image/random").then(response => response.json()) as object;

                randomEmb
                    .setTitle("Random - Dog")
                    .setURL("https://dog.ceo/")
                    .setAuthor({name: "Dog Ceo", url: "https://dog.ceo/", iconURL: "https://dog.ceo/img/favicon.png"})
                    .setColor(config.getColors().ok)
                    .setImage(await dog.message);
                
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }
        case "kangaroo":
            row.components[0].setCustomId(`random-again-kangaroo${userId? "-" + userId: ""}`);

            if (!errors.length) {
                let kanga: any = await fetch("https://some-random-api.ml/animal/kangaroo").then(response => response.json());

                randomEmb
                    .setTitle("Random - Kangaroo")
                    .setURL("https://some-random-api.ml")
                    .setAuthor({name: "Some Random Api", url: "https://some-random-api.ml", iconURL: "https://i.some-random-api.ml/logo.png"})
                    .setColor(config.getColors().ok)
                    .setImage(await kanga.image);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }

        case "fox":
            row.components[0].setCustomId(`random-again-fox${userId? "-" + userId: ""}`);

            if (!errors.length) {
                let fox: any = await fetch("https://some-random-api.ml/animal/fox").then(response => response.json());

                randomEmb
                    .setTitle("Random - Fox")
                    .setURL("https://some-random-api.ml")
                    .setAuthor({name: "Some Random Api", url: "https://some-random-api.ml", iconURL: "https://i.some-random-api.ml/logo.png"})
                    .setColor(config.getColors().washedOut.ok)
                    .setImage(await fox.image);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }

        case "panda":
            row.components[0].setCustomId(`random-again-panda${userId? "-" + userId: ""}`);

            if (!errors.length) {
                let panda: any = await fetch("https://some-random-api.ml/animal/panda").then(response => response.json());

                randomEmb
                    .setTitle("Random - Panda")
                    .setURL("https://some-random-api.ml")
                    .setAuthor({name: "Some Random Api", url: "https://some-random-api.ml", iconURL: "https://i.some-random-api.ml/logo.png"})
                    .setColor(config.getColors().ok)
                    .setImage(await panda.image);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }

        case "joke":
            row.components[0].setCustomId(`random-again-joke${userId? "-" + userId: ""}`);

            if (!errors.length) {
                let joke: any = await fetch("https://some-random-api.ml/joke").then(response => response.json());

                randomEmb
                    .setTitle("Random - Joke")
                    .setURL("https://some-random-api.ml")
                    .setAuthor({name: "Some Random Api", url: "https://some-random-api.ml", iconURL: "https://i.some-random-api.ml/logo.png"})
                    .setColor(config.getColors().ok)
                    .setDescription(await joke.joke);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }
        
        case "dadjoke":
        case "dad-joke":
            row.components[0].setCustomId(`random-again-dadjoke${userId? "-" + userId: ""}`);

            if (!errors.length) {
                let joke: any = await fetch("https://icanhazdadjoke.com",{headers: {Accept: "application/json"}}).then(response => response.json());

                randomEmb
                    .setTitle("Random - Dad Joke")
                    .setURL("https://icanhazdadjoke.com/j/"+joke.id)
                    .setAuthor({name: "icanhazdadjoke", url: "https://icanhazdadjoke.com"})
                    .setColor(config.getColors().ok)
                    .setDescription(await joke.joke);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }

        case "quote":
            row.components[0].setCustomId(`random-again-quote${userId? "-" + userId: ""}`);

            if (!errors.length) {
                let quote: any = await fetch("https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json").then(response => response.json());

                randomEmb
                    .setTitle("Random - Quote")
                    .setURL("https://forismatic.com/en/homepage")
                    .setAuthor({name: "Forismatic", url: "https://forismatic.com/en/", /* iconURL: "https://forismatic.com/favicon.ico"*/})
                    .setColor(config.getColors().ok)
                    .setDescription(`"${italic(await quote.quoteText)}" (${await quote.quoteAuthor})`);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }

        case "affirmation":
            row.components[0].setCustomId(`random-again-affirmation${userId? "-" + userId: ""}`);

            if (!errors.length) {
                let quote: any = await fetch("https://www.affirmations.dev").then(response => response.json());

                randomEmb
                    .setTitle("Random - Affirmation")
                    .setURL("https://www.affirmations.dev")
                    .setAuthor({name: "Affirmations.dev", url: "https://github.com/annthurium/affirmations", /* iconURL: "https://forismatic.com/favicon.ico"*/})
                    .setColor(config.getColors().ok)
                    .setDescription(await quote.affirmation);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }

        case "insult":
            row.components[0].setCustomId(`random-again-insult${userId? "-" + userId: ""}`);

            if (!errors.length) {
                let insult: any = await fetch("https://evilinsult.com/generate_insult.php?lang=en&type=json").then(response => response.json());

                randomEmb
                    .setTitle("Random - Insult")
                    .setURL("https://evilinsult.com/generate_insult.php")
                    .setAuthor({name: "Evil Insult", url: "https://evilinsult.com/", /* iconURL: "https://forismatic.com/favicon.ico"*/})
                    .setColor(config.getColors().ok)
                    .setDescription(await insult.insult);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }

        case "excuse":
            row.components[0].setCustomId("random-again-excuse"+ `${input.text1?`-(${input.text1})`:""}${userId? "-" + userId: ""}`);

            if (!errors.length) {
                let excuse: any = await fetch("https://excuser.herokuapp.com/v1/excuse/"+ `${input.text1 ? input.text1:""}`).then(response => response.json());

                randomEmb
                    .setTitle("Random - Excuse"+`${input.text1?" - "+inlineCode(input.text1):""}`)
                    .setURL("https://excuser.herokuapp.com")
                    .setAuthor({name: "Excuser", url: "https://excuser.herokuapp.com/", /* iconURL: "https://forismatic.com/favicon.ico"*/})
                    .setColor(config.getColors().ok)
                    .setDescription(await excuse[0].excuse);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }

        case "fact":
            row.components[0].setCustomId(`random-again-fact${userId? "-" + userId: ""}`);

            if (!errors.length) {
                /** @type Object() */
                let quote: any = await fetch("https://uselessfacts.jsph.pl/random.json?language=en").then(response => response.json());

                randomEmb
                    .setTitle("Random - Fact")
                    .setURL("https://uselessfacts.jsph.pl/")
                    .setAuthor({name: "Useless Facts", url: "https://uselessfacts.jsph.pl/", /* iconURL: "https://forismatic.com/favicon.ico"*/})
                    .setColor(config.getColors().ok)
                    .setDescription(await quote.text)
                    .setFooter({text:"Source: "+await quote.source});
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }
            
        case "koala":
            row.components[0].setCustomId(`random-again-koala${userId? "-" + userId: ""}`);

            if (!errors.length) {
                /** @type Object() */
                let kanga: any = await fetch("https://some-random-api.ml/animal/koala").then(response => response.json());

                randomEmb
                    .setTitle("Random - Koala")
                    .setURL("https://some-random-api.ml")
                    .setAuthor({name: "Some Random Api", url: "https://some-random-api.ml", iconURL: "https://i.some-random-api.ml/logo.png"})
                    .setColor(config.getColors().ok)
                    .setImage(await kanga.image);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }
        case "bird":
            row.components[0].setCustomId(`random-again-bird${userId? "-" + userId: ""}`);

            if (!errors.length) {
                /** @type Object() */
                let bird: any = await fetch("https://shibe.online/api/birds?count=1").then(response => response.json());

                randomEmb
                    .setTitle("Random - Bird")
                    .setURL("https://shibe.online/")
                    .setAuthor({name: "Shibe Online", url: "https://shibe.online/", /* iconURL: "https://shibe.online/assets/favicon.ico" */})
                    .setColor(config.getColors().ok)
                    .setImage(await bird[0]);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }

        case "duck":
            row.components[0].setCustomId(`random-again-duck${userId? "-" + userId: ""}`);

            if (!errors.length) {
                /** @type Object() */
                let duck: any = await fetch("https://random-d.uk/api/v2/quack").then(response => response.json());

                randomEmb
                    .setTitle("🦆 Duck")
                    .setURL("https://random-d.uk/")
                    // .setAuthor({name: "random-d.uk", url: "https://random-d.uk/", iconURL: "https://random-d.uk/static/favicon-dark.png"})
                    .setColor(config.getColors().ok)
                    .setImage(await duck.url);
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }
        case "zooanim":
        case "zoo-anim":
            row.components[0].setCustomId(`random-again-zooanim${userId? "-" + userId: ""}`);

            if (!errors.length) {
                /** @type Object() */
                let zoo: any = await fetch("https://zoo-animal-api.herokuapp.com/animals/rand").then(response => response.json());

                randomEmb
                    .setTitle("Random - Zoo Animal")
                    .setURL("https://zoo-animal-api.herokuapp.com/")
                    .setAuthor({name: "Zoo Animal Api", url: "https://zoo-animal-api.herokuapp.com/"})
                    .setColor(config.getColors().ok)
                    .setImage(await zoo.image_link)
                    .setFooter({text: `Type: ${zoo.name} (${zoo.animal_type})`});
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }
        case "emoji":
            row.components[0].setCustomId(`random-again-emoji${userId? "-" + userId: ""}`);

            if (!errors.length) {
                /** @type Object() */
                let emojies: any = await fetch("https://emojihub.herokuapp.com/api/random").then(response => response.json());
                let str="";
                
                for (let emoji of emojies.htmlCode) {
                    str += String.fromCodePoint(Number(emoji.replace("&#", "").replace(";", "")));
                }
                
                randomEmb
                 .setTitle("Random - Emoji")
                 .setURL("https://emojihub.herokuapp.com/")
                 .setAuthor({
                  name: "emoji hub",
                  url: "https://emojihub.herokuapp.com/",
                 })
                 .setColor(config.getColors().ok)
                 .addFields([{name: str, value:`⤷ ${emojies.name}\n⤷ (${emojies.category})\n⤷ [[emojipedia](https://emojipedia.org/${str})] `}])
                 .setFooter({ text: str + str + str + str + str });
//                  .setDescription(
//                   str +
//                    ": " +
//                    emojies.name +
//                    `\n[[emojipedia](https://emojipedia.org/${str})] `
//                  );
                return { embeds: [randomEmb], components: [row] };
            } else {

                errorEmb.setDescription("• " + errors.join("\n• "));
                return { embeds: [errorEmb] };
            }

        case "number": {
            input.num1 ||= 0;
            input.num2 ||= 100;
            row.components[0].setCustomId(`random-again-number-(${input.num1}-${input.num2})`);
            
            let min = Math.ceil(input.num1);
            let max = Math.floor(input.num2);

            randomEmb
                .setTitle(`Random - \`min:${input.num1} max:${input.num2}\``)
                .setColor(config.getColors().ok)
                .setDescription(`${Math.floor(Math.random() * (max - min) + min).toLocaleString()}`);
            return { embeds: [randomEmb], components: [row] };
            }

        case "randompost":
        case "randomPost":
        case "random-post": 
        {
            let data = await reddit(config, type, input.text1 || "", userId);
            return data;
        }

        }
    return { embeds: [errorEmb] };
}


export async function autoComplete(engine: string, input: string ): Promise<ApplicationCommandOptionChoiceData[]> {
    switch (engine) {
        case "random-post": {
            return await redditAutoComplete("sub-reddit", input);
        }
    }
    return [];

}


export async function button(config: Config, id: string, userId?: string): Promise<InteractionReplyOptions> {
    userId;
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
    } else if (idActual == "excuse") {
        text1 = String(await getBetweenStr(id, "(", ")")) || "";
    }

    let data = await random(config, idActual, {num1, num2, text1}, userId);

    return data as InteractionReplyOptions;
}


export function applicationCommands(config?: Config, envEnabledList?: EnvEnabled) {
    config; envEnabledList; // Just so it is used

    let randomSlashCommand = new SlashCommandBuilder()
        .setName("random")
        .setDescription("Produces random results")
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("number")
                .setDescription("A random number")
                .addNumberOption(
                    new SlashCommandNumberOption()
                        .setName("min")
                        .setDescription("The min the random number can go")
                ).addNumberOption(
                    new SlashCommandNumberOption()
                        .setName("max")
                        .setDescription("The max the random number can go")
                )
        );
    if (config?.apiEnabled.randomSmallOnes.randomImage) {
        randomSlashCommand.addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("cat")
                .setDescription("🐱 A random cat image")
        ).addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("dog")
                .setDescription("🐶 A random dog image")
        );
        randomSlashCommand.addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("kangaroo")
                .setDescription("🦘 A random kangaroo image")
        );
        randomSlashCommand.addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("fox")
                .setDescription("🦊 A random fox image")
        );
        randomSlashCommand.addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("panda")
                .setDescription("🐼 A random panda image")
        );
        randomSlashCommand.addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("joke")
                .setDescription("🤣 A random joke")
        );
        randomSlashCommand.addSubcommand(
         new SlashCommandSubcommandBuilder()
          .setName("koala")
          .setDescription("🐨 A random koala image")
        );
        randomSlashCommand.addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("dad-joke")
                .setDescription("🤣 A random dad joke")
        );
        randomSlashCommand.addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("bird")
                .setDescription("🐦 A random bird image")
        );
        randomSlashCommand.addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("duck")
                .setDescription("🦆 A random duck image")
        );
        randomSlashCommand.addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("zoo-anim")
                .setDescription("A random zoo animal")
        );
    }
    if (config?.apiEnabled.randomSmallOnes.randomText) {
        randomSlashCommand.addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("quote")
                .setDescription("🗨️ A random quote")
        ).addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("affirmation")
                .setDescription("A random affirmation")
        ).addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("insult")
                .setDescription("😢 A random insult")
        ).addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("excuse")
                .setDescription("A random excuse")
                .addStringOption(
                    new SlashCommandStringOption()
                        .setName("category")
                        .setDescription("The category of the excuse")
                        .setRequired(false)
                        .addChoices(
                            {name: "Family", value: "family"},
                            {name: "Office", value: "office"},
                            {name: "Children", value: "children"},
                            {name: "Collage", value: "collage"},
                            {name: "Party", value: "party"}
                        )
                )
        ).addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("fact")
                .setDescription("A random fact")
        ).addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("emoji")
                .setDescription("A random emoji")
        );
    }
    if (config?.apiEnabled.reddit) {
        randomSlashCommand.addSubcommandGroup(
            new SlashCommandSubcommandGroupBuilder()
                .setName("reddit")
                .setDescription("Use Reddit to ...")
                .addSubcommand(
                    new SlashCommandSubcommandBuilder()
                        .setName("random-post")
                        .setDescription("Uses Reddit and your selected subreddit")
                        .addStringOption(
                            new SlashCommandStringOption()
                                .setName("sub-reddit")
                                .setDescription("The subreddit to get a random post from")
                                .setRequired(true)
                                .setAutocomplete(true)
                        )
                )
        );
    }
    return [randomSlashCommand];
}