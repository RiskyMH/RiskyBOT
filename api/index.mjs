/* eslint-disable */

// This file is to link the others files together

import { existsSync } from "fs";

// export const config = {
//     runtime: "experimental-edge",
// };

export default function handler(req, res) {
    console.time("Execute");
    let location = "dist/" + req.url.split("?")[0].split("/api/")[1] + ".mjs"
    console.log(req.url)
    
    if (existsSync(location)) {
        return import("../"+location).then(module => module.default(req, res).then(console.timeEnd("Execute")));
    } else {
        return res.status(404).json("API not found");
    };
}