const { MessageEmbed } = require("discord.js");
const discordjs = require("discord.js");
const tools = require("../tools.js");

/**
 * @param {discordjs.Client} client
 * @param {string} message
 * @param {discordjs.ColorResolvable} colorGoo
 * @param {discordjs.ColorResolvable} colorErr
 * @param {discordjs.User} user
 * @param {discordjs.ApplicationCommandPermissionsManager} permissions
 * @param {discordjs.BaseGuildTextChannel} channel
 * @export {discordjs.InteractionReplyOptions}
 */

module.exports = async function say(
  client,
  message,
  colorGoo,
  colorErr,
  user,
  permissions,
  channel
) {
  let doneEmb = new MessageEmbed()
    // @ts-ignore
    .setColor(colorGoo)
    .setTitle("Done!");

  let errorEmb = new MessageEmbed()
    .setTitle("Errors - say")
    .setColor(colorErr);
  let errors = [];

  if (!channel){
    errors.push("This command doesn't work in `DMs`");
  }
  if (channel?!channel.threads:null) {
    errors.push("This command doesn't work in `threads`");
  }
  if (!permissions.has("MANAGE_WEBHOOKS")){
      errors.push("This bot doesn't have permissions to to this (`MANAGE_WEBHOOKS`)")
  }

  if (!errors.length) {
      const webhook = await tools.webhookMakeOrFind(
        channel,
        client.user.username,
        client.user.id
      );
      await webhook.send({
        content: message,
        username: user.username,
        avatarURL: user.displayAvatarURL(),
      });

      return {
        embeds: [doneEmb.setDescription("Sent message in this channel")],
        ephemeral: true,
      };
  }
  errorEmb.setDescription("• " + errors.join("\n• "));

  return { embeds: [errorEmb], ephemeral: true };
};
