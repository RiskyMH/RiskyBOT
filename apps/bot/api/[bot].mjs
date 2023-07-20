/* eslint-disable */
console.log("INTERACTION RECEIVED");

import { handle as handleRiskyBot } from "@riskybot/riskybot";
import { handle as handleImgen } from "@riskybot/imgen";

/**
 * @param {import('@vercel/node').VercelRequest} request
 * @param {import('@vercel/node').VercelResponse} response
 */
export default async function handler(request, response) {
    console.time("Execute");

    const { bot } = request.query;

    if (bot === 'riskybot') {
        // @ts-expect-error
        await handleRiskyBot(request, response);
    } else if (bot === 'imgen') {
        // @ts-expect-error
        await handleImgen(request, response);
    } else {
        return response.status(404).json({ error: "API not found" });
    }

    console.timeEnd("Execute");

    return;

}