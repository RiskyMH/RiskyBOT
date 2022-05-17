import { EmbedBuilder, inlineCode, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import type { User, CommandInteractionOption, InteractionReplyOptions } from "discord.js";
import type { Config, EnvEnabled } from "@riskybot/tools";
import fetch from "node-fetch";

const nekoBaseURL = "https://nekobot.xyz/api/";
const sraBaseURL = "https://some-random-api.ml/";

//TODO: Make sure everything works...
//TODO: Migrate the fetch into `@riskybot/apis`


export default async function fun(config: Config, type: string, inputUser1: User, inputMember1: CommandInteractionOption["member"], inputUser2: User, inputText: string): Promise<InteractionReplyOptions> {
 let funEmb = new EmbedBuilder().setTitle("Fun").setColor(config.getColors().ok);

 /** @type Object */
//  let fun: object = {};

 switch (type) {
  case "clyde-say":
   {
    let fun: any = await fetch(
     nekoBaseURL +
      "imagegen?" +
      new URLSearchParams({ type: "clyde", text: inputText })
    ).then((response) => response.json());
    funEmb
     .setImage(await fun.message)
     .setAuthor({ name: "nekobot", url: "http://nekobot.xyz" })
     .setTitle("Fun - `Clyde Say`");
   }
   break;
  case "ship":
   {
    let fun: any = await fetch(
     nekoBaseURL +
      "imagegen?" +
      new URLSearchParams({
       type: "ship",
       user1: inputUser1.displayAvatarURL(),
       user2: inputUser2.displayAvatarURL(),
      })
    ).then((response) => response.json());
    funEmb
     .setImage(await fun.message)
     .setAuthor({ name: "nekobot", url: "http://nekobot.xyz" })
     .setTitle("Fun - `Ship`");
   }
   break;
  case "captcha":
   {
    let fun: any = await fetch(
     nekoBaseURL +
      "imagegen?" +
      new URLSearchParams({
       type: "captcha",
       url: inputUser1.displayAvatarURL(),
       username: inputUser1.username,
      })
    ).then((response) => response.json());
    funEmb
     .setImage(await fun.message)
     .setAuthor({ name: "nekobot", url: "http://nekobot.xyz" })
     .setTitle("Fun - `Captcha`");
   }
   break;
  case "whowouldwin":
   {
    let fun: any = await fetch(
     nekoBaseURL +
      "imagegen?" +
      new URLSearchParams({
       type: "whowouldwin",
       user1: inputUser1.displayAvatarURL(),
       user2: inputUser2.displayAvatarURL(),
      })
    ).then((response) => response.json());
    funEmb
     .setImage(await fun.message)
     .setAuthor({ name: "nekobot", url: "http://nekobot.xyz" })
     .setTitle("Fun - `Who Would Win`");
   }
   break;
  case "changemymind":
   {
    let fun: any = await fetch(
     nekoBaseURL +
      "imagegen?" +
      new URLSearchParams({ type: "changemymind", text: inputText })
    ).then((response) => response.json());
    funEmb
     .setImage(await fun.message)
     .setAuthor({ name: "nekobot", url: "http://nekobot.xyz" })
     .setTitle("Fun - `Change My Mind`");
   }
   break;
  case "iphonex":
   {
    let fun: any = await fetch(
     nekoBaseURL +
      "imagegen?" +
      new URLSearchParams({
       type: "iphonex",
       url: inputUser1.displayAvatarURL(),
      })
    ).then((response) => response.json());
    funEmb
     .setImage(await fun.message)
     .setAuthor({ name: "nekobot", url: "http://nekobot.xyz" })
     .setTitle("Fun - `iPhone X`");
   }
   break;
  case "trump-tweet":
   {
    let fun: any = await fetch(
     nekoBaseURL +
      "imagegen?" +
      new URLSearchParams({ type: "trumptweet", text: inputText })
    ).then((response) => response.json());
    funEmb
     .setImage(await fun.message)
     .setAuthor({ name: "nekobot", url: "http://nekobot.xyz" })
     .setTitle("Fun - `Trump Tweet`");
   }
   break;
  case "tweet":
   {
    //  let let fun: any = await fetch(nekoBaseURL+"imagegen?type=tweet&text="+inputText+"&username="+inputUser1.username).then((response) => response.json())
    //  funEmb.setImage(await fun.message).setAuthor("nekobot", "", "http://neekobot.xyz").setTitle("Fun - `Tweet`")
    let fun: any = await fetch(
     sraBaseURL +
      "canvas/tweet?" +
      // @ts-expect-error - using types that isn't existing (vscode)
      new URLSearchParams({comment: inputText,username: inputUser1.username, avatar: inputUser1.displayAvatarURL({ format: "png" }), displayname: inputMember1?.displayName ?? inputUser1.username,})
    ).then((response) => response.url);
    funEmb
     .setImage(await fun)
     .setAuthor({
      name: "Some Random Api",
      url: "https://some-random-api.ml",
      iconURL: "https://i.some-random-api.ml/logo.png",
     })
     .setTitle("Fun - `tweet`");
   }
   break;
  case "deepfry":
   {
    let fun: any = await fetch(
     nekoBaseURL +
      "imagegen?" +
      new URLSearchParams({
       type: "deepfry",
       image: inputUser1.displayAvatarURL(),
      })
    ).then((response) => response.json());
    funEmb
     .setImage(await fun.message)
     .setAuthor({ name: "nekobot", url: "http://nekobot.xyz" })
     .setTitle("Fun - `Deepfry`");
   }
   break;
  case "blurpify":
   {
    let fun: any = await fetch(
     nekoBaseURL +
      "imagegen?" +
      new URLSearchParams({
       type: "blurpify",
       image: inputUser1.displayAvatarURL(),
      })
    ).then((response) => response.json());
    funEmb
     .setImage(await fun.message)
     .setAuthor({ name: "nekobot", url: "http://neekobot.xyz" })
     .setTitle("Fun - `Blurpify`");
   }
   break;
  case "hack": {
   funEmb
    .setTitle(`Hacking - ${inlineCode(inputUser1.tag)}`)
    .setFooter({ text: "💯 Totally legit and legal" });

   switch (inputText) {
    case "0":
     // @ts-expect-error - using types that isn't existing (vscode)
     funEmb.setDescription(`Hacking ${inputMember1?.displayName ?? inputUser1.username} now...`);
     break;
    case "1":
     funEmb.setDescription(
      `[**${randomNum(0, 10)}%**] Finding discord login... (2fa bypassed)`
     );
     break;
    case "2":
     funEmb.setDescription(
      `[**${randomNum(10, 12)}%**] Found: \n • **Email**: ${inlineCode(
       getRandom(fakeHackOptions.email).replace(
        "{USERNAME}",
        inputUser1.username
       )
      )}\n • **Password**:  ${inlineCode(getRandom(fakeHackOptions.password))}`
     );
     break;
    case "3":
     funEmb.setDescription(
      `[**${randomNum(
       15,
       20
      )}%**] Fetching dms with closest friends (if there are any friends at all)`
     );
     break;
    case "4":
     funEmb.setDescription(
      `[**${randomNum(20, 22)}%**] **Last DM:** "${getRandom(
       fakeHackOptions.dm
      )}"`
     );
     break;
    case "5":
     funEmb.setDescription(
      `[**${randomNum(25, 30)}%**] Finding most common word...`
     );
     break;
    case "6":
     funEmb.setDescription(
      `[**${randomNum(30, 32)}%**] \`const mostCommonWord = '${getRandom(
       fakeHackOptions.commonWord
      )}'\``
     );
     break;
    case "7":
     funEmb.setDescription(
      `[**${randomNum(
       35,
       40
      )}%**] Injecting trojan virus into discriminator \`#${
       inputUser1.discriminator
      }\``
     );
     break;
    case "8":
     funEmb.setDescription(
      `[**${randomNum(40, 50)}%**] Virus injected, emotes stolen ${getRandom(
       fakeHackOptions.emote
      )}`
     );
     break;
    case "9":
     funEmb.setDescription(
      `[**${randomNum(
       50,
       55
      )}%**] Hacking Epic Store account.... <a:chugMyJug:575417466214285316>`
     );
     break;
    case "10":
     funEmb.setDescription(
      `[**${randomNum(
       55,
       57
      )}%**] Breached Epic Store Account: No More 19 Dollar Fortnite Cards :x:`
     );
     break;
    case "11":
     funEmb.setDescription(`[**${randomNum(60, 70)}%**] Finding IP address`);
     break;
    case "12":
     funEmb.setDescription(
      `[**${randomNum(70, 72)}%**] **IP address:** 127.0.0.1:${Math.round(
       Number(randomNum(1000, 9999).replace(",", ""))
      )}`
     );
     break;
    case "13":
     funEmb.setDescription(
      `[**${randomNum(75, 80)}%**] Selling data to the Government...`
     );
     break;
    case "14":
     funEmb.setDescription(
      `[**${randomNum(
       90,
       100
      )}%**] Reporting account to Discord for breaking TOS...`
     );
     break;
    case "15":
     // @ts-expect-error - using types that isn't existing (vscode)
     funEmb.setDescription(`[**${randomNum(100, 100)}%**] Finished hacking ${inputMember1?.displayName ?? inputUser1.username}`
     );
     break;
    case "16":
     funEmb.setDescription(
      `[**${"100"}%**] The _totally_ real and dangerous hack is complete`
     );
     break;
   }
  }
 }

 return { embeds: [funEmb] };
}

const fakeHackOptions = {
 email: ["{USERNAME}NotFound@gmail.com", "mommyloves{USERNAME}@outlook.com"],
 password: ["PA55W0RD", "123456Seven", "ilovemom"],
 dm: ["I hope blueballs aren't real", "man i love my mommy"],
 commonWord: ["chungus", "sussy", "e"],
 emote: [
  "<:peepee:589828801484161066>",
  "<a:yummylips:680098324044578866>",
  "<a:blelele:575409317461884929>",
 ],
};

/**
 * @param {number} min
 * @param {number} max
 * @returns {string}
 */
function randomNum(min: number, max: number): string {
 return (Math.random() * (max - min) + min).toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
 });
}

/**
 * @param {Array} list
 * @returns {any}
 */
function getRandom(list: Array<any>): any {
 return list[Math.floor(Math.random() * list.length)];
}


export function applicationCommands(config: Config, envEnabledList?: EnvEnabled) {

  envEnabledList; // Just so it is used
  let funSlashCommand = new SlashCommandBuilder()
    .setName("fun")
    .setDescription("🤣 Produces fun results")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("hack")
        .setDescription("Hack someone - TOTALLY LEGIT AND LEGAL")
        .addUserOption(
          new SlashCommandUserOption()
            .setName("user")
            .setDescription("The user to hack")
            .setRequired(true)
        )
    );

  if (config.apiEnabled.someRandomApi) {
    funSlashCommand.addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("tweet")
          .setDescription("Tweet a message - ...")
          .addUserOption(
            new SlashCommandUserOption()
              .setName("user")
              .setDescription("The author for tweet")
              .setRequired(true)
          ).addStringOption(
            new SlashCommandStringOption()
              .setName("message")
              .setDescription("The message for tweet")
              .setRequired(true)
          )
      );
  }
  if (config.apiEnabled.nekobot) {
    funSlashCommand
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("clyde-say")
          .setDescription("Clyde say - ...")
          .addStringOption(
            new SlashCommandStringOption()
              .setName("message")
              .setDescription("What clyde is saying")
              .setRequired(true)
          )
      ).addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("ship")
          .setDescription("Ship 2 users - ...")
          .addUserOption(
            new SlashCommandUserOption()
              .setName("user1")
              .setDescription("A user")
              .setRequired(true)
          ).addUserOption(
            new SlashCommandUserOption()
              .setName("user2")
              .setDescription("Another user")
              .setRequired(true)
          )
      ).addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("whowouldwin")
          .setDescription("Who Would Win - ...")
          .addUserOption(
            new SlashCommandUserOption()
              .setName("user1")
              .setDescription("A user")
              .setRequired(true)
          ).addUserOption(
            new SlashCommandUserOption()
              .setName("user2")
              .setDescription("Another user")
              .setRequired(true)
          )
      ).addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("changemymind")
          .setDescription("Change My Mind - ...")
          .addStringOption(
            new SlashCommandStringOption()
              .setName("message")
              .setDescription("The message")
              .setRequired(true)
          )
      ).addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("trump-tweet")
          .setDescription("Tweet a message as Trump - ...")
          .addStringOption(
            new SlashCommandStringOption()
              .setName("message")
              .setDescription("The message for tweet")
              .setRequired(true)
          )
      ).addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("iphonex")
          .setDescription("iPhone X - ...")
          .addUserOption(
            new SlashCommandUserOption()
              .setName("user")
              .setDescription("Who's avatar to use")
              .setRequired(true)
          )
      ).addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("deepfry")
          .setDescription("Deepfry - ...")
          .addUserOption(
            new SlashCommandUserOption()
              .setName("user")
              .setDescription("Who's avatar to use")
              .setRequired(true)
          )
      ).addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("blurpify")
          .setDescription("Blurpify - ...")
          .addUserOption(
            new SlashCommandUserOption()
              .setName("user")
              .setDescription("Who's avatar to use")
              .setRequired(true)
          )
      ).addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("captcha")
          .setDescription("Captcha - ...")
          .addUserOption(
            new SlashCommandUserOption()
              .setName("user")
              .setDescription("Who's avatar to use")
              .setRequired(true)
          )
      );
  }

  return [funSlashCommand];
}