const discordjs = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { hyperlink, inlineCode } = require("@discordjs/builders");
const tools = require("../tools.js");

const deepai = require("deepai"); // OR include deepai.min.js as a script tag in your HTML

/**
 * @param {discordjs.Client} client
 * @param {string} input
 * @param {string} type
 * @param {discordjs.HexColorString} color
 * @param {string} deepaiKey
 * @exports discordjs.InteractionReplyOptions
 */

module.exports = async function (client, input, type, color, deepaiKey) {
  if (!deepaiKey){return {content: "deepai not working"}}

  deepai.setApiKey(deepaiKey);
  let deepEmbed = new MessageEmbed();

  switch (type) {
    case "text-generator":      
        var resp = await deepai.callStandardApi("text-generator", {
          text: input,
        });
        deepEmbed
          .setTitle("Text generation - " + inlineCode(tools.trim(input,15)))
          .setURL("https://deepai.org/machine-learning-model/text-generator")
          .setDescription(tools.trim(await resp.output, 1024))
          .setFooter("AI made by: deepai");
      
      break;

    // switch
  }
  deepEmbed
    .setAuthor("deepai","","https://deepai.org/")
    .setColor(color)
  
  return { embeds: [deepEmbed] };

};
