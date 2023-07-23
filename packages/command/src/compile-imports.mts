#!/usr/bin/env node

import { glob } from "glob";
import path from "node:path";

const folder = path.join(process.cwd(), "dist/commands/**/*.mjs")
    .replace(/\\/g, "/");

const files = glob.sync(folder);

// make a file for the imports (export * from "./file.mjs")
let importFile = "";
for (const file of files) {
    const location = file
        .replace(process.cwd(), ".")
        .replace("C:\\", "/")
        .replaceAll("\\", "/")
        .replace("/dist/commands", "");
    if (/^(?:.*[\\/])?_[^\\/]*$/.test(location)) continue;

    importFile += `export * from "${location}";\n`;
}

// save the file to the dist folder (dist/imports.mjs)
import fs from "node:fs";
fs.writeFileSync(path.join(process.cwd(), "dist/commands/index.mjs"), importFile);
