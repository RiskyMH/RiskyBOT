const discordjs = require("discord.js");
const { time, hyperlink, inlineCode, userMention, bold , formatEmoji} = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const tools = require("../tools.js");
/**
 * @param {discordjs.Client} client
 * @param {discordjs.CommandInteractionOption} option
 * @param {discordjs.HexColorString} color
 * @param {discordjs.HexColorString} colorErr
 * @param {string} extra
 * @exports discordjs.InteractionReplyOptions
 */
module.exports = async function (client, option, color, colorErr,extra) {
  let aboutEmbed = new MessageEmbed();
  let aboutEmbedAdv = new MessageEmbed();
  let flags = {
    HYPESQUAD_EVENTS: "<:HypeSquadEvents:899099369742155827>",
    BUGHUNTER_LEVEL_2: "<:BugHunterLevel2:899099369767313429>",
    BUGHUNTER_LEVEL_1: "<:BugHunterLevel1:899099369989615616>",
    EARLY_SUPPORTER: "<:EarlySupporter:899099370056724500>",
    HOUSE_BALANCE: "<:HouseBalance:899099370069319680>",
    DISCORD_CERTIFIED_MODERATOR: "<:DiscordCertifiedModerator:899099370077716480>",
    HOUSE_BRILLIANCE: "<:HouseBrilliance:899099370090295367>",
    DISCORD_EMPLOYEE: "<:DiscordEmployee:899099370161586217>",
    HOUSE_BRAVERY: "<:HouseBravery:899099370186760213>",
    EARLY_VERIFIED_BOT_DEVELOPER: "<:EarlyVerifiedBotDeveloper:899099370190946354>",
    VERIFIED_BOT: "<:VerifiedBot:899099370228695130>",
    TEAM_USER: "<:TeamUser:899099370232889364>",
    PARTNERED_SERVER_OWNER: "<:PartneredServerOwner:899099370396450827>",
  };

  if (option.member !== undefined || null) {
    aboutEmbed
      .setTitle("About - "+inlineCode("User:")+ bold(inlineCode(option.member.displayName)))
      .setThumbnail(option.member.user.avatarURL())

      .addField("Made", time(option.member.user.createdAt)+ " ("+time(option.member.user.createdAt, "R")+")")
      .addFields(
        {name: "Username", value: inlineCode(option.member.user.username), inline: true,
        }, {name: "Discriminator", value: inlineCode(option.member.user.discriminator), inline: true,
        }, { name: "Full", value: inlineCode(option.member.user.tag), inline: true })

      .addField("Joined server at", time(option.member.joinedAt))
      .addFields(
        { name: "Server nickname", value: option.member.nickname ? inlineCode(option.member.nickname) : "*No nickname set*", inline: true },
        { name: "User", value: userMention(option.member.user.id), inline: true })
      .addField("Server name", inlineCode(option.member.guild.name))
      if (option.member.premiumSince) aboutEmbed.addField("Boosing since", time(option.member.premiumSince))
      if (option.member.user.flags.toArray().length) aboutEmbed.addField("Badges", (option.member.user.flags.toArray().map(e=> flags[e]).join("  ")))
      
      if (extra === "advanced"){ 
      aboutEmbedAdv
      .setTitle("About - "+inlineCode("User:")+ bold(inlineCode(option.member.displayName))+inlineCode("(advanced)"))

      .addField("ID", inlineCode(option.member.id))
      .addField("Default Avatar URL", option.member.user.defaultAvatarURL)
      .addField("Current Avatar URL", hyperlink("https://cdn.discordapp.com/avatars/...",option.member.user.avatar?option.member.user.avatarURL():option.member.user.displayAvatarURL()))
      .addField("Boosing since", option.member.premiumSince ? time(option.member.premiumSince) : "*Not boosing*")
      .addField("Roles", option.member.roles.cache.map((r) => r).join(", "))
      .addField("Permissions",option.member.permissions.toArray().length ? inlineCode(tools.toTitleCase(option.member.permissions.toArray().join("`    `"))): "*No permissions*")
      }
  } else if (option.role !== undefined || null) {
    aboutEmbed
      .setTitle("About - "+inlineCode("Role:")+ bold(inlineCode(option.role.name)))
      
      .addField("Made", time(option.role.createdAt)+ " ("+time(option.role.createdAt, "R")+")")
      if (extra === "advanced"){
    aboutEmbedAdv
      .setTitle("About - "+inlineCode("Role:")+ bold(inlineCode(option.role.name))+inlineCode("(advanced)"))
      .addField("ID", inlineCode(option.role.id))
      .addField("Members", option.role.members.size ? option.role.members.map((r) => r).join(", "): "*No members*")
      .addField("Permissions",option.role.permissions.toArray().length ? inlineCode(tools.toTitleCase(option.role.permissions.toArray().join("`    `"))): "*No permissions*")
      }
  } else if (option.user !== undefined || null) {
    aboutEmbed
      .setTitle("About - "+inlineCode("User:")+ bold(inlineCode(option.user.username)))
      .setThumbnail(option.user.avatarURL())
    
      .addField("Made", time(option.user.createdAt)+ " ("+time(option.user.createdAt, "R")+")")
      .addFields(
        {name: "Username",value: inlineCode(option.user.username),inline: true,
        },{name: "Discriminator",value: inlineCode(option.user.discriminator),inline: true,
        },{name: "Full",value: inlineCode(option.user.tag),inline: true})
      if (option.user.flags.toArray().length) aboutEmbed.addField("Badges", (option.user.flags.toArray().map(e=> flags[e]).join("  ")))

    
    if (extra === "advanced"){  
    aboutEmbedAdv
      .setTitle("About - "+inlineCode("User:")+ bold(inlineCode(option.user.username))+inlineCode("(advanced)"))
      .addField("Default Avatar URL", option.user.defaultAvatarURL)
      .addField("Current Avatar URL", hyperlink("https://cdn.discordapp.com/avatars/...",option.user.avatar?option.user.avatarURL():option.user.displayAvatarURL()))
      .addField("ID", inlineCode(option.user.id))
  }}

  aboutEmbed
    .setColor(color)
  aboutEmbedAdv
    .setColor(color);

  if (!extra) return { embeds: [aboutEmbed] };
  else return { embeds: [aboutEmbed, aboutEmbedAdv] };
};
