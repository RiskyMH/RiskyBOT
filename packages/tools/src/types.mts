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
    /** The washed out variants to be used when not as important */
    washedOut: {
        /**  When something has completed normally but... */
        ok: colorType;
    }
};
/** Which APIs will be enabled */
type ApiEnabled = {
    /** Is the `Reddit` api being used? */
    reddit: boolean;
    /** Is the `Top.gg` api being used? */
    topgg: boolean;
    /** Is the `DeepAI` api being used? */
    deepai: boolean;
    /** Is the `Nekobot.xyz` api being used? */
    nekobot: boolean;
    /** Is the `Some-Random-Api.ml` api being used? */
    someRandomApi: boolean;
    /** Is the `Urban Dictionary` api being used? */
    urbanDictionary: boolean;
    /** Is the `Google Translate` api being used? */
    googleTranslate: boolean;
    /** Is some of the small api category's being used? */
    randomSmallOnes: {
        /** Is the api's under the category of `Random Image` (provides an image) being used? */
        randomImage: boolean;
        /** Is the api's under the category of `Random Text` (provides text) being used? */  
        randomText: boolean;    
    }
}

/** The settings for the bot */
export interface ConfigType {
    /** The colors the bot uses - taken from https://discord.com/branding */
    colors: ConfigColors;
    apiEnabled: ApiEnabled;
}

