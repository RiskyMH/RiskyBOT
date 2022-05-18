// import { Config } from "./tools.mjs";

// Helpers
type colorType = import("discord.js").HexColorString;


//? //////////// ?////////////////////////////
//? Config File  ?/////////////////////////// 
//? //////////   ?//////////////////////////

/** The colors the bot uses - taken from https://discord.com/branding */
type ConfigColors = {
 /** When something has completed normally */
 ok: colorType;
 /** When something has an error */
 error: colorType;
 /** When something has had a good outcome */
 good: colorType;
 /** When something has not fully complected... */
 warning: colorType;
};
/** Which APIs will be enabled */
type ApiEnabled = {
    reddit: boolean;
    topgg: boolean;
    deepai: boolean;
    nekobot: boolean;
    someRandomApi: boolean;
    urbandictionary: boolean;
    googletranslate: boolean;
    randomSmallOnes: {
        pastegg: boolean;
        rhymebrain: boolean;
        awsrandomcat: boolean;
        dogceo: boolean;
        icanhazdadjoke: boolean;
        forismatic: boolean;
        affirmationsdev: boolean;
        evilinsultcom: boolean;
        excuserheroku: boolean;
        uselessfactspl: boolean;
        shibeonline: boolean;
        randomduk: boolean;
        zooanimalapiheroku: boolean;
        emojihubheroku: boolean;
        
    }
}

/** The settings for the bot */
export type ConfigJSON = {
    /** The colors the bot uses - taken from https://discord.com/branding */
    colors: ConfigColors;
    apiEnabled: ApiEnabled;
};

