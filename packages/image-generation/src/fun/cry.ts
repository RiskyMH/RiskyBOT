// CREDITS:
// - Images and ideas from: https://github.com/DankMemer/imgen

import { GlobalFonts, createCanvas, loadImage } from "@napi-rs/canvas";
import { rel, wrapText } from "../tools.ts";

import cryBMP from "../../assets/cry/cry.bmp";
import TahomaTTF from "../../assets/fonts/tahoma.ttf";
import TwitterColorEmojiTTF from "../../assets/fonts/TwitterColorEmoji.ttf";

const imageBg = loadImage(rel(cryBMP));
GlobalFonts.registerFromPath(rel(TahomaTTF), "tahoma");
GlobalFonts.registerFromPath(rel(TwitterColorEmojiTTF), "twemoji");


export default async function makeImg(input: { text: string }): Promise<Buffer | { error?: string }> {

    const canvas = createCanvas(626, 768);
    const context = canvas.getContext("2d");

    try {
        context.drawImage(await imageBg, 0, 0, canvas.width, canvas.height);

    } catch (error) { console.error(error); return { error: "Error when fetching assets" }; }

    context.font = "900 20pt tahoma, twemoji";
    wrapText(context, input.text, 385, 85, 175, 24 + 12);

    return canvas.toBuffer("image/png");
}
