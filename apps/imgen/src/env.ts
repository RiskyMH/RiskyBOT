import { object, string, parse } from "valibot";

const EnvRequirementsSchema = object({
    IMGEN_APPLICATION_PUBLIC_KEY: string("Add the env var `IMGEN_APPLICATION_PUBLIC_KEY`"),
});


export const env = parse(EnvRequirementsSchema, process.env);
