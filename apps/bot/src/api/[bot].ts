/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */
// @ts-nocheck

console.log("INTERACTION RECEIVED");

import { handle as handleRiskyBot } from "@riskybot/riskybot";
import { handle as handleImgen } from "@riskybot/imgen";


export default async function handler(request, response) {
    console.time("Execute");

    const { bot } = request.query;
    const req = await makeRequest(request);

    if (bot === 'riskybot') {
        const resp = await handleRiskyBot(req);
        responseFn(response, resp);
    } else if (bot === 'imgen') {
        const resp = await handleImgen(req);
        responseFn(response, resp);
    } else {
        return response.status(404).json({ error: "API not found" });
    }

    console.timeEnd("Execute");

    return;

}

async function makeRequest(req): Promise<Request> {
    const { method, headers, body, url } = req;
    // TODO: implement query param

    const request = new Request("http://localhost" + url, {
        method,
        // @ts-expect-error scamming APIs to work... expected error
        headers,
        body: body ? JSON.stringify(body) : undefined
    });

    return request;
}


async function responseFn(res, response: Response) {
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));

    res.send(Buffer.from(await response.arrayBuffer()));
}
