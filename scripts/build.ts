await Bun.build({
    entrypoints: ["./src/index.ts"],
    target: "bun",
    outdir: "./dist",
    // sourcemap: "inline",
    splitting: true,
    // minify: true,
    external: [
        "ci-info",
        "discord-api-types/v10",
        "picocolors",
        "@riskybot/tools",
        "@discordjs/builders",
        "@discordjs/formatters",
        "@riskybot/apis",
        "@riskybot/command", 
        "@riskybot/image-generate",
        "@sapphire/shapeshift",
        "@sapphire/snowflake",
        "discord-api-parser",
        "discord-api-types",
        "lru-cache",
        "@napi-rs/canvas"
    ],
    
});


export {};

somethingdoentexist!                (


   "