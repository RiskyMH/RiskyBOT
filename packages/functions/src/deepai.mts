import { bold, ContextMenuCommandBuilder, inlineCode, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder, EmbedBuilder } from "@discordjs/builders";
import * as tools from "@riskybot/tools";
import type { InteractionReplyOptions } from "discord.js";
import type { Config, EnvEnabled } from "@riskybot/tools";
// @ts-expect-error The function has no types :(
import { default as deepaiFunc } from "deepai";
import { ApplicationCommandType } from "discord-api-types/v10";


//TODO: Make sure everything works...


export default async function deepai(config: Config, input:string, type:string, deepaiKey:string = ""): Promise <InteractionReplyOptions> {
 if (!deepaiKey) {
  console.error("DeepAI requires key");
  return { content: "DeepAI not working" };
 }

 deepaiFunc.setApiKey(deepaiKey);
 let deepEmbed = new EmbedBuilder();

 switch (type) {
  case "text-generator":
   var resp = await deepaiFunc.callStandardApi("text-generator", {text: input});
   console.log(resp);
   deepEmbed
    .setTitle("Text generation - " + inlineCode(tools.trim(input, 15)))
    .setURL("https://deepai.org/machine-learning-model/text-generator")
    .setDescription(
     tools.trim(await resp.output.replace(input, bold(input)), 4096)
    )
    .setFooter({ text: "AI made by: deepai" });

   break;

  // switch
 }
 deepEmbed
  .setAuthor({ name: "deepai", url: "https://deepai.org/" })
  .setColor(config.getColors().ok);

 return { embeds: [deepEmbed] };
}


export function applicationCommands(config: Config, envEnabledList?: EnvEnabled) {

    if (config.apiEnabled.deepai && envEnabledList?.HasDeepApi) {
        let deepaiSlashCommand = new SlashCommandBuilder()
            .setName("deep-ai")
            .setDescription("Uses AI to produce results")
            .addSubcommand(
                new SlashCommandSubcommandBuilder()
                    .setName("text-generator")
                    .setDescription("Generates text from a given text")
                    .addStringOption(
                        new SlashCommandStringOption()
                            .setName("text")
                            .setDescription("The text to generate")
                            .setRequired(true)
                    )
            );
        let deepaiUserCommand = new ContextMenuCommandBuilder()
            .setName("Continue message - Deepai")
            .setType(ApplicationCommandType.Message);
        return [deepaiSlashCommand, deepaiUserCommand];
  }
  return [];

}