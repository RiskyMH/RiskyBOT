
export interface BasicError {
    title: string;
    message: string;
    author?: {
        name: string;
        image: string | undefined;
        url: string | undefined;
    }
}

export interface LogError {
    title: string;
    message: string;
    more?: string;
}

export default class RiskyBotError extends Error {
    error: BasicError;

    /** Advanced info... this can be more when extended */
    advanced: object;

    /** If extended, this can be used for filtering errors */
    type = "Error";

    /** More information can be provided to webhook (less facing) */
    logError: LogError;

    constructor(error: BasicError, advanced: object, logError: LogError) {
        super(JSON.stringify({ advanced: advanced || error, logError }, null, 2));
        this.error = error;
        this.advanced = advanced;
        this.logError = logError;
    }


}

export { RiskyBotError };