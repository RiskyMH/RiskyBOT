const { MessageEmbed } = require("discord.js");
const discordjs = require("discord.js");
const { hyperlink, inlineCode } = require("@discordjs/builders");
const { translate } = require("google-translate-api-browser");
const tools = require("../tools.js")

/**
 * @param {discordjs.Client} client
 * @param {string} input
 * @param {string} to
 * @param {string} from
 * @param {discordjs.HexColorString} color
 * @export {discordjs.InteractionReplyOptions}
 */

module.exports = async function (client, input, to, from, color) {
var langs = {
    auto: "Automatic",
    af: "Afrikaans",
    sq: "Albanian",
    am: "Amharic",
    ar: "Arabic",
    hy: "Armenian",
    az: "Azerbaijani",
    eu: "Basque",
    be: "Belarusian",
    bn: "Bengali",
    bs: "Bosnian",
    bg: "Bulgarian",
    ca: "Catalan",
    ceb: "Cebuano",
    ny: "Chichewa",
    "zh-cn": "Chinese (Simplified)",
    "zh-tw": "Chinese (Traditional)",
    co: "Corsican",
    hr: "Croatian",
    cs: "Czech",
    da: "Danish",
    nl: "Dutch",
    en: "English",
    eo: "Esperanto",
    et: "Estonian",
    tl: "Filipino",
    fi: "Finnish",
    fr: "French",
    fy: "Frisian",
    gl: "Galician",
    ka: "Georgian",
    de: "German",
    el: "Greek",
    gu: "Gujarati",
    ht: "Haitian Creole",
    ha: "Hausa",
    haw: "Hawaiian",
    iw: "Hebrew",
    hi: "Hindi",
    hmn: "Hmong",
    hu: "Hungarian",
    is: "Icelandic",
    ig: "Igbo",
    id: "Indonesian",
    ga: "Irish",
    it: "Italian",
    ja: "Japanese",
    jw: "Javanese",
    kn: "Kannada",
    kk: "Kazakh",
    km: "Khmer",
    ko: "Korean",
    ku: "Kurdish (Kurmanji)",
    ky: "Kyrgyz",
    lo: "Lao",
    la: "Latin",
    lv: "Latvian",
    lt: "Lithuanian",
    lb: "Luxembourgish",
    mk: "Macedonian",
    mg: "Malagasy",
    ms: "Malay",
    ml: "Malayalam",
    mt: "Maltese",
    mi: "Maori",
    mr: "Marathi",
    mn: "Mongolian",
    my: "Myanmar (Burmese)",
    ne: "Nepali",
    no: "Norwegian",
    ps: "Pashto",
    fa: "Persian",
    pl: "Polish",
    pt: "Portuguese",
    ma: "Punjabi",
    ro: "Romanian",
    ru: "Russian",
    sm: "Samoan",
    gd: "Scots Gaelic",
    sr: "Serbian",
    st: "Sesotho",
    sn: "Shona",
    sd: "Sindhi",
    si: "Sinhala",
    sk: "Slovak",
    sl: "Slovenian",
    so: "Somali",
    es: "Spanish (espagnol)",
    su: "Sundanese",
    sw: "Swahili",
    sv: "Swedish",
    tg: "Tajik",
    ta: "Tamil",
    te: "Telugu",
    th: "Thai",
    tr: "Turkish",
    uk: "Ukrainian",
    ur: "Urdu",
    uz: "Uzbek",
    vi: "Vietnamese",
    cy: "Welsh",
    xh: "Xhosa",
    yi: "Yiddish",
    yo: "Yoruba",
    zu: "Zulu"
};

  let ans = await translate(input, { to: to, from: from });
  // @ts-expect-error
  let translated = await ans.text;
  // @ts-expect-error
  let fromNew = await ans.from.language.iso;
  let fromBetter = await langs[fromNew];
  let toBetter = await langs[to];

  const exampleEmbed = new MessageEmbed()
    .setColor(color)
    .setTitle("Translate - "+inlineCode(tools.trim(input,15)))
    .setURL("https://translate.google.com")
    .setAuthor(
      "google translate (via: github)",
      "",
      "https://github.com/cjrsgu/google-translate-api-browser/"
    )
    .addField(await fromBetter, input.slice(0, 1024), true)
    .addField(await toBetter, await translated.slice(0, 1024), true)
    
  return { embeds: [exampleEmbed] };
};
