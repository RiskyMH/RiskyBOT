// import riskybotClient from "./riskybot.mjs";
import type { VercelRequest, VercelResponse } from "@vercel/node";
// import "dotenv/config";

export default async function (request: VercelRequest, response: VercelResponse): Promise<void | VercelResponse> {
    // console.log(request);
    if (request.url === "/api") {
        response.json({ hello: "world" });
        return;
    }

    return response.status(404).json("Not found");

}
