import { EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import type { InteractionDataResolvedGuildMember, InteractionGuildMember, User } from "discord-api-parser";
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
  }

  return { embeds: [funEmb] };
}


export function applicationCommands(config?: Config, envEnabledList?: EnvEnabled) {
  // eslint-disable-next-line no-unused-expressions
  envEnabledList; // Just so it is used

  const funSlashCommand = new SlashCommandBuilder()
    .setName("fun")
    .setDescription("🤣 Produces fun results");

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