import { object, string, parse } from "valibot";

const EnvRequirementsSchema = object({
    IMGEN_APPLICATION_PUBLIC_KEY: string(),
});


export const env = parse(EnvRequirementsSchema, process.env);
