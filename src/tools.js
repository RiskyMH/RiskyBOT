const discordjs = require("discord.js");

/**
 * @param {string} str
 * @exports string
 */
module.exports.toTitleCase = function (str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
/**
 * @param {discordjs.BaseGuildTextChannel} channel
 * @param {string} webhookName
 * @param {string} botID
 * @exports discordjs.Webhook
 */
module.exports.webhookMakeOrFind = async function (
  channel,
  webhookName,
  botID
) {
  let webhooks = await channel.fetchWebhooks();
  let webhook = webhooks.find(
    (u) => (u.name === webhookName) && (u.owner.id === botID)
  );

  if (!webhook) {
    channel
      .createWebhook(webhookName, {})
      .then((webhook) => console.log(`Created webhook ${webhook}`))
      .catch(console.error);

    webhooks = await channel.fetchWebhooks();
    webhook = await webhooks.find(
      (u) => (u.name === webhookName) && (u.owner.id === botID)
    );
  }
  return webhook;
};

module.exports.mergeObjs = function (obj1, obj2) {
    const merged = {};
    let keys1 = Object.keys(obj1);
    keys1.forEach((k1) => {
      merged[k1] = obj2[k1] || obj1[k1]; // replace values from 2nd object, if any
    });
    Object.keys(obj2).forEach((k2) => {
      if (!keys1.includes(k2)) merged[k2] = obj1[k2]; // add additional properties from second object, if any
    });
   
  return merged;
}
module.exports.dateBetter =  function (inputUTC) {
  let UTC = new Date(inputUTC);

  let min = ("00" + UTC.getMinutes()).slice(-2);
  let hour = ("00" + UTC.getHours()).slice(-2);
  let daynum = ("00" + UTC.getDate()).slice(-2);
  let month = ("00" + UTC.getMonth()).slice(-2);
  let year = ("0000" + UTC.getFullYear()).slice(-2);

  let date = `${hour}:${min} ${daynum}/${month}/${year}`;

  return date;
}
/**
 * @param {string} str
 * @param {number} max
 * @exports string
 */
module.exports.trim = (str, max) =>
  str.length > max ? `${str.slice(0, max - 1)}…` : str;
