const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const discordjs = require("discord.js");
const {
  time,
  hyperlink,
  inlineCode,
  userMention,
} = require("@discordjs/builders");
const tools = require("../tools.js");
const fetch = require("node-fetch");
/**
 * @param {discordjs.Client} client
 * @param {discordjs.HexColorString} color
 * @param {discordjs.HexColorString} colorErr
 * @param {string} type
 * @param {number} num1
 * @param {number} num2
 * @export {discordjs.InteractionReplyOptions}
 */

module.exports = async function random (client, color, colorErr, type, num1, num2) {
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

  switch (type) {
    case "cat":
    row.components[0].setCustomId("random-again-cat");
    let errors = [];
      if (num1||num2) {
        if (num1) {
          errors.push("`num1` isn't used for this");
        }
        if (num2) errors.push("`num2` isn't used for this");
      }

      if (!errors.length) {
         let cat = await fetch('https://aws.random.cat/meow').then(response => response.json());
          
        randomEmb
          .setTitle("Random - Cat")
          .setURL("https://aws.random.cat/view")
          .setAuthor("random cat", "", "https://aws.random.cat/view")
          .setColor(color)
          .setImage(await cat.file)
          return { embeds: [randomEmb], components: [row]};
      }else{

  errorEmb.setDescription("• " + errors.join("\n• "));
  return { embeds: [ errorEmb] };}
break
  case "number":
    row.components[0].setCustomId("random-again-number");
    if (!num1) num1 = 0
    if (!num2) num2=100;
    let min = Math.ceil(num1);
    let max = Math.floor(num2);
    randomEmb
    .setTitle(`Random - \`min:${num1} max:${num2}\``)
    .setColor(color)
    .setDescription(`${Math.floor(Math.random() * (max - min) + min)}`);
    return { embeds: [randomEmb], components: [row] };
}};

