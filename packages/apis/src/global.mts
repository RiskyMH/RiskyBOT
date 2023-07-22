// If something is so good that it can be used for all files

import Error, { BasicError } from "@riskybot/error";
import { ArrayValidator } from "@sapphire/shapeshift";
import { Response } from "undici";


export const jsonHeaders = {
    headers: {
        Accept: "application/json",
    },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare type InferArrayType<T extends ArrayValidator<any>> = T extends ArrayValidator<any, infer U> ? U[] : never;


interface APIErrorAdvanced {
    url: string;
    status: number;
    statusText: string;
    text?: string;
}

export class APIError extends Error {
    type = "APIError";
    declare advanced: APIErrorAdvanced;
    constructor(error: BasicError, fetch: Response, extra?: string) {

        const advanced: APIErrorAdvanced = {
            url: fetch.url,
            status: fetch.status,
            statusText: fetch.statusText,
            text: JSON.stringify(extra, null, 2) ?? "",
        };
        // make log error based on advanced
        const LogError = {
            title: "Error in API call",
            message: `Error in API call to ${advanced.url} and status ${advanced.status} (${advanced.statusText})`,
            more: advanced.text,
        };

        super(error, advanced, LogError);

    }
}