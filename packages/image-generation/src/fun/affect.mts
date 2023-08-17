// CREDITS:
// - Images and ideas from: https://github.com/DankMemer/imgen

import { Image, createCanvas, loadImage } from "@napi-rs/canvas";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { request } from "undici";

const __dirname = dirname(fileURLToPath(import.meta.url));

const imageBg = loadImage(path.join(__dirname, "../../assets", "affect/affect.bmp"));


export default async function makeImg(input: { imgLink: string }): Promise<Buffer | { error?: string }> {
    const canvas = createCanvas(500, 636);
    const context = canvas.getContext("2d");
    context.fillStyle = "#36393f";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    try {
        const { body: bodyImg } = await request(input.imgLink);
        const imgBuffer = await bodyImg.arrayBuffer();
        
        context.drawImage(await imageBg, 0, 0, canvas.width, canvas.height);
        
        const image = new Image();
        image.src = Buffer.from(imgBuffer);
        context.drawImage(image, 180, 383, 200, 157);
        
    } catch (error) { console.error(error); return { error: "Error when loading images" }; }
    
    return canvas.toBuffer("image/png");
}
