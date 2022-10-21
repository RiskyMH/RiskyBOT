// CREDITS:
// - Images and ideas from: https://github.com/DankMemer/imgen

import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import { wrapText } from "../tools.mjs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imageBg = loadImage(path.join(__dirname, "../../assets", "cry/cry.bmp"));
GlobalFonts.registerFromPath(path.join(__dirname,"../../assets" , "fonts/tahoma.ttf"), "tahoma");
GlobalFonts.registerFromPath(path.join(__dirname,"../../assets" , "fonts/TwitterColorEmoji.ttf"), "twemoji");

export default async function makeImg(input: { text: string }): Promise<Buffer | {error?: string}> {

    const canvas = createCanvas(626, 768);
    const context = canvas.getContext("2d");

    try{
        context.drawImage(await imageBg, 0, 0, canvas.width, canvas.height);
        
    } catch (e) {console.error(e); return{error: "Error when fetching assets"};}

    context.font = "900 20pt tahoma, twemoji";
    wrapText(context, input.text, 385, 85, 175, 24 + 12);

    return canvas.toBuffer("image/png");
}
