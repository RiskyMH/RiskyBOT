// If something is so good that it can be used for all files

import Error, { BasicError } from "@riskybot/error";
import { Response } from "undici";

export default true;


interface APIErrorAdvanced {
    url: string;
    status: number;
    statusText: string;
    responseText: string;
    extra?: string;
}

export class APIError extends Error {
    type = "APIError";
    declare advanced: APIErrorAdvanced ;
    constructor(error: BasicError, fetch: Response, extra?: string) {

        const advanced: APIErrorAdvanced = {
            url: fetch.url,
            status: fetch.status,
            statusText: fetch.statusText,
            responseText: fetch.body?.toString() ?? "Even more unknown",
            extra: extra,
        };
        // make log error based on advanced
        const LogError = {
            title: "Error in API call",
            message: `Error in API call to ${advanced.url} and status ${advanced.status} (${advanced.statusText})`,
        };

        super(error, advanced, LogError);

    }
}