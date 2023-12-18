// If something is so good that it can be used for all files

import Error, { type BasicError } from "@riskybot/error";
import { type BaseSchema, type Output, safeParse } from "valibot";


export const jsonHeaders = {
    headers: {
        Accept: "application/json",
    },
};


interface APIErrorAdvanced {
    url: string;
    status: number;
    statusText: string;
    text?: string;
}

export class APIError extends Error {
    override type = "APIError";
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

export async function parseAPI<TSchema extends BaseSchema>(fetchUrl: string | URL, schema: TSchema, customError: BasicError): Promise<Output<TSchema>> {
    const result = await fetch(fetchUrl, jsonHeaders);

    if (!result.ok) {
        throw new APIError(customError, result, await result.text());
    }

    const parsed = safeParse(schema, await result.json());

    if (!parsed.success || parsed.issues) {
        throw new APIError(customError, result, JSON.stringify(parsed.issues, null, 2));
    }

    return parsed.output;
}
