import { EmbedBuilder, inlineCode, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import type { InteractionDataResolvedGuildMember, InteractionGuildMember, User } from "@riskybot/discord-interactions";
import type { Config, EnvEnabled } from "@riskybot/tools";
import { ImageFormat } from "discord-api-types/v10";
import { fetch } from "undici";

const nekoBaseURL = "https://nekobot.xyz/api/";
const sraBaseURL = "https://some-random-api.ml/";

//TODO: Make sure everything works...
//TODO: Migrate the fetch into `@riskybot/apis`


export default async function fun(config: Config, type: string, input: { user1?: User, member1?: InteractionGuildMember | InteractionDataResolvedGuildMember, user2?: User, text1?: string } = { user1: undefined, member1: undefined, user2: undefined, text1: undefined }) {
  const funEmb = new EmbedBuilder().setTitle("Fun").setColor(config.getColors().ok);

  /** @type Object */
  //  let fun: object = {};

  switch (type) {
    case "clyde-say":
      {
        if (!input.text1) throw new Error("You need to specify a `text1` for input");
        const fun: any = await fetch(
          nekoBaseURL +
          "imagegen?" +
          new URLSearchParams({ type: "clyde", text: input.text1 ?? "" })
        ).then((response) => response.json());
        funEmb
          .setImage(await fun.message)
          .setAuthor({ name: "nekobot", url: "http://nekobot.xyz" })
          .setTitle("Fun - `Clyde Say`");
      }
      break;
    case "ship":
      {
        if (!input.user1 || !input.user2) throw new Error("You need to specify `user1` and `user2` for input");
        const fun: any = await fetch(
         nekoBaseURL +
          "imagegen?" +
          new URLSearchParams({
           type: "ship",
           user1: input.user1.displayAvatarURL({ extension: ImageFormat.PNG, size: 512 }),
           user2: input.user2.displayAvatarURL({ extension: ImageFormat.PNG, size: 512 }),
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
        if (!input.user1 || !input.user2) throw new Error("You need to specify `user1` and `user2` for input");
        const fun: any = await fetch(
          nekoBaseURL +
          "imagegen?" +
          new URLSearchParams({
            type: "captcha",
            url: input.user1.displayAvatarURL({ extension: ImageFormat.PNG, size: 512 }),
            username: input.user1.username,
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
        if (!input.user1 || !input.user2) throw new Error("You need to specify `user1` and `user2` for input");
        const fun: any = await fetch(
          nekoBaseURL +
          "imagegen?" +
          new URLSearchParams({
            type: "whowouldwin",
            user1: input.user1.displayAvatarURL({ extension: ImageFormat.PNG, size: 512 }),
            user2: input.user2.displayAvatarURL({ extension: ImageFormat.PNG, size: 512 }),
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
        if (!input.text1) throw new Error("You need to specify `text1` for input");
        const fun: any = await fetch(
          nekoBaseURL +
          "imagegen?" +
          new URLSearchParams({ type: "changemymind", text: input.text1 })
        ).then((response) => response.json());
        funEmb
          .setImage(await fun.message)
          .setAuthor({ name: "nekobot", url: "http://nekobot.xyz" })
          .setTitle("Fun - `Change My Mind`");
      }
      break;
    case "iphonex":
      {
        if (!input.user1) throw new Error("You need to specify `user1` for input");
        const fun: any = await fetch(
          nekoBaseURL +
          "imagegen?" +
          new URLSearchParams({
            type: "iphonex",
            url: input.user1.displayAvatarURL({ extension: ImageFormat.PNG, size: 512 }),
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
        if (!input.text1) throw new Error("You need to specify `text1` for input");
        const fun: any = await fetch(
          nekoBaseURL +
          "imagegen?" +
          new URLSearchParams({ type: "trumptweet", text: input.text1 })
        ).then((response) => response.json());
        funEmb
          .setImage(await fun.message)
          .setAuthor({ name: "nekobot", url: "http://nekobot.xyz" })
          .setTitle("Fun - `Trump Tweet`");
      }
      break;
    case "tweet":
      {
        if (!input.text1 || !input.user1) throw new Error("You need to specify `text1` and `user1` for input");
        //  let let fun: any = await fetch(nekoBaseURL+"imagegen?type=tweet&text="+input.text1+"&username="+input.user1.username).then((response) => response.json())
        //  funEmb.setImage(await fun.message).setAuthor("nekobot", "", "http://neekobot.xyz").setTitle("Fun - `Tweet`")
        const fun: any = await fetch(
          sraBaseURL +
          "canvas/tweet?" +
          new URLSearchParams({ comment: input.text1, username: input.user1.username, avatar: input.user1.displayAvatarURL({ extension: ImageFormat.PNG, size: 512 }), displayname: input?.member1?.nickname ?? input.user1.username, })
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
        if (!input.user1) throw new Error("You need to specify `user1` for input");
        const fun: any = await fetch(
          nekoBaseURL +
          "imagegen?" +
          new URLSearchParams({
            type: "deepfry",
            image: input.user1.displayAvatarURL({ extension: ImageFormat.PNG, size: 512 }),
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
        if (!input.user1) throw new Error("You need to specify `user1` for input");
        const fun: any = await fetch(
          nekoBaseURL +
          "imagegen?" +
          new URLSearchParams({
            type: "blurpify",
            image: input.user1.displayAvatarURL({ extension: ImageFormat.PNG, size: 512 }),
          })
        ).then((response) => response.json());
        funEmb
          .setImage(await fun.message)
          .setAuthor({ name: "nekobot", url: "http://neekobot.xyz" })
          .setTitle("Fun - `Blurpify`");
      }
      break;
    case "hack": {
      if (!input.user1) throw new Error("You need to specify `user1` for input");
      funEmb
        .setTitle(`Hacking - ${inlineCode(input.user1.tag)}`)
        .setFooter({ text: "💯 Totally legit and legal" });

      switch (input.text1) {
        case "0":
          funEmb.setDescription(`Hacking ${input.member1?.nickname ?? input.user1.username} now...`);
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
                input.user1.username
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
            )}%**] Injecting trojan virus into discriminator \`#${input.user1.discriminator
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
          funEmb.setDescription(`[**${randomNum(100, 100)}%**] Finished hacking ${input.member1?.nickname ?? input.user1.username}`
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


export function applicationCommands(config?: Config, envEnabledList?: EnvEnabled) {
  // eslint-disable-next-line no-unused-expressions
  envEnabledList; // Just so it is used

  const funSlashCommand = new SlashCommandBuilder()
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

  if (config?.apiEnabled.someRandomApi) {
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
  if (config?.apiEnabled.nekobot) {
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