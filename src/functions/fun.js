const { MessageEmbed } = require("discord.js");
const discordjs = require("discord.js");
const {
  time,
  hyperlink,
  inlineCode,
  userMention,
} = require("@discordjs/builders");
const tools = require("../tools.js");
const fetch = require("node-fetch");

const nekoBaseURL = "https://nekobot.xyz/api/";

/**
 * @param {discordjs.Client} client
 * @param {string} type
 * @param {discordjs.User} inputUser1
 * @param {discordjs.User} inputUser2
 * @param {string} inputText
 * @param {discordjs.HexColorString} color
 * @param {discordjs.HexColorString} colorErr
 * @export {discordjs.InteractionReplyOptions}
 */

module.exports = async function (client, type,inputUser1, inputUser2,inputText,color, colorErr) {
  let funEmb = new MessageEmbed().setTitle("Fun").setAuthor("neko").setColor(color);
  let errorEmb = new MessageEmbed().setTitle("Errors - fun").setColor(colorErr);
  let errors = [];

    try{

    if (type == "clyde-say" || type=="changemymind" || type=="trump-tweet") {
      // just text
      if (!inputText){
        errors.push("This command needs input `text`");
      }
      if (inputUser1 || inputUser2){
        errors.push("To much data, this command needs input `text`");
      }
    } else if (type == "ship" || type == "whowouldwin") {
      // user1 + user2
      if ((!inputUser1) || (!inputUser2)) {
        errors.push("This command needs input `user1`+`user2`");
      }
      if (inputText || inputText) {
        errors.push("To much data, this command needs input `user1`+`user2`");
      }
    } else if ( type == "tweet") {
      // user1 + text
      if ((!inputUser1) || (!inputText)) {
        errors.push("This command needs input `user1`+`text`");
      }
      if (inputUser2) {
        errors.push("To much data, this command needs input `user1`");
      }
    } else if (type == "captcha" || type == "iphonex" || type == "deepfry" || type == "blurpify") {
      // image1
      if (!inputUser1 ) {
        errors.push("This command needs input `user1`");
      }
      if (inputUser2 || inputText) {
        errors.push("To much data, this command needs input `user1`");
      }
    }
    if (!errors.length){
    switch (type){
        case "clyde-say":{
            let fun = await fetch(nekoBaseURL+"imagegen?type=clyde&text="+inputText).then((response) => response.json())
            funEmb.setImage(await fun.message).setAuthor("nekobot", "", "http://neekobot.xyz").setTitle("Fun - `Clyde Say`")
        } break
        case "ship":{
            let fun = await fetch(nekoBaseURL+"imagegen?type=ship&user1="+(inputUser1.avatar?inputUser1.avatarURL():inputUser1.displayAvatarURL())+"&user2="+(inputUser2.avatar?inputUser2.avatarURL():inputUser2.displayAvatarURL())).then((response) => response.json())
            funEmb.setImage(await fun.message).setAuthor("nekobot", "", "http://neekobot.xyz").setTitle("Fun - `Ship`")
        }break
        case "captcha":{
            let fun = await fetch(nekoBaseURL+"imagegen?type=captcha&url="+(inputUser1.avatar?inputUser1.avatarURL():inputUser1.displayAvatarURL())+"&username="+inputUser1.username).then((response) => response.json())
            funEmb.setImage(await fun.message).setAuthor("nekobot", "", "http://neekobot.xyz").setTitle("Fun - `Captcha`")
        }break
        case "whowouldwin":{
            let fun = await fetch(nekoBaseURL+"imagegen?type=whowouldwin&user1="+(inputUser1.avatar?inputUser1.avatarURL():inputUser1.displayAvatarURL())+"&user2="+(inputUser2.avatar?inputUser2.avatarURL():inputUser2.displayAvatarURL())).then((response) => response.json())
            funEmb.setImage(await fun.message).setAuthor("nekobot", "", "http://neekobot.xyz").setTitle("Fun - `Who Would Win`")
        }break
        case "changemymind":{
            let fun = await fetch(nekoBaseURL+"imagegen?type=changemymind&text="+inputText).then((response) => response.json())
            funEmb.setImage(await fun.message).setAuthor("nekobot", "", "http://neekobot.xyz").setTitle("Fun - `Change My Mind`")
        }break
        case "iphonex":{
            let fun = await fetch(nekoBaseURL+"imagegen?type=iphonex&url="+(inputUser1.avatar?inputUser1.avatarURL():inputUser1.displayAvatarURL())).then((response) => response.json())
            funEmb.setImage(await fun.message).setAuthor("nekobot", "", "http://neekobot.xyz").setTitle("Fun - `iPhone X`")
        }break
        case "trump-tweet":{
            let fun = await fetch(nekoBaseURL+"imagegen?type=trumptweet&text="+inputText).then((response) => response.json())
            funEmb.setImage(await fun.message).setAuthor("nekobot", "", "http://neekobot.xyz").setTitle("Fun - `Trump Tweet`")
        }break
        case "tweet":{
            let fun = await fetch(nekoBaseURL+"imagegen?type=tweet&text="+inputText+"&username="+inputUser1.username).then((response) => response.json())
            funEmb.setImage(await fun.message).setAuthor("nekobot", "", "http://neekobot.xyz").setTitle("Fun - `Tweet`")
        }break
        case "deepfry":{
            let fun = await fetch(nekoBaseURL+"imagegen?type=deepfry&image="+(inputUser1.avatar?inputUser1.avatarURL():inputUser1.displayAvatarURL())).then((response) => response.json())
            funEmb.setImage(await fun.message).setAuthor("nekobot", "", "http://neekobot.xyz").setTitle("Fun - `Deepfry`")
        }break
        case "blurpify":{
            let fun = await fetch(nekoBaseURL+"imagegen?type=blurpify&image="+(inputUser1.avatar?inputUser1.avatarURL():inputUser1.displayAvatarURL())).then((response) => response.json())
            funEmb.setImage(await fun.message).setAuthor("nekobot", "", "http://neekobot.xyz").setTitle("Fun - `Blurpify`")
        }
    }
  return { embeds: [funEmb] };
}else{
    errorEmb.setDescription("• " + errors.join("\n• "));

    return  { embeds: [errorEmb], ephemeral: true };
}
}catch{
        return { embeds: [errorEmb.setDescription("A error happend")], ephemeral: true };
}
};
