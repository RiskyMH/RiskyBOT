import type { SKRSContext2D } from "@napi-rs/canvas";
import path from "node:path";
import { fileURLToPath } from "node:url";


export function wrapText(context: SKRSContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(" ");
    let line = "";

    for (const [n, word] of words.entries()) {
        const testLine = line + word + " ";
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = word + " ";
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

export const rel = (relativePath: string) => {
    if (relativePath.startsWith("./")) return path.join(fileURLToPath(import.meta.url), "../", relativePath);
    return relativePath;
};