const random = require("./random.js");
const discordjs = require("discord.js")
/**
 * @param {discordjs.Client} client
 * @param {string} id
 * @param {discordjs.MessageEmbed} embed
 * @export {discordjs.InteractionReplyOptions}
 */
module.exports.random = async function (client, id, embed) {
  let num1 = 0;
  let num2 = 0;
  if (id == "number") {
    num1 = Number(
      embed.title.substring(
        embed.title.indexOf(":") + 1,
        embed.title.lastIndexOf(" max:")
      )
    );
    num2 = Number(
      embed.title.substring(
        embed.title.indexOf(":") + 1,
        embed.title.lastIndexOf("`")
      ).split(":")[1]
    );
  }
  let data = await random(client, embed.hexColor, "#0000", id, num1, num2);
  return await data;
};
