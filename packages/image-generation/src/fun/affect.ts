// CREDITS:
// - Images and ideas from: https://github.com/DankMemer/imgen

import { Image, createCanvas, loadImage } from "@napi-rs/canvas";
import affectBMP from "../../assets/affect/affect.bmp";
import { rel } from "../tools.ts";

const imageBg = loadImage(rel(affectBMP));

export default async function makeImg(input: { imgLink: string }): Promise<Buffer | { error?: string }> {
    const canvas = createCanvas(500, 636);
    const context = canvas.getContext("2d");
    context.fillStyle = "#36393f";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    try {
      
        context.drawImage(await imageBg, 0, 0, canvas.width, canvas.height);
        
        const image = new Image();
        const img = await fetch(input.imgLink);
        image.src = Buffer.from(await img.arrayBuffer());
        context.drawImage(image, 180, 383, 200, 157);
        
    } catch (error) { console.error(error); return { error: "Error when loading images" }; }
    
    return canvas.toBuffer("image/png");
}
