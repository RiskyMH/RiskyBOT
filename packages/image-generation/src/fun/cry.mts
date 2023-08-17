// CREDITS:
// - Images and ideas from: https://github.com/DankMemer/imgen

import { GlobalFonts, createCanvas, loadImage } from "@napi-rs/canvas";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { wrapText } from "../tools.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const imageBg = loadImage(path.join(__dirname, "../../assets", "cry/cry.bmp"));
GlobalFonts.registerFromPath(path.join(__dirname, "../../assets", "fonts/tahoma.ttf"), "tahoma");
GlobalFonts.registerFromPath(path.join(__dirname, "../../assets", "fonts/TwitterColorEmoji.ttf"), "twemoji");

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
