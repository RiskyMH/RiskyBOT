await Bun.build({
    entrypoints: ["./src/index.ts"],
    target: "node",
    outdir: "./dist",
    // sourcemap: "inline",
    splitting: true,
    // minify: true,
    external: [
        "ci-info",
        "picocolors",
        "lilybird",
        "@lilybird/jsx",
        "@riskybot/tools",
        "@riskybot/discord-types",
        "@riskybot/apis",
        "@riskybot/command", 
        "@riskybot/image-generate",
        "@sapphire/shapeshift",
        "@sapphire/snowflake",
        "discord-api-parser",
        "lru-cache",
        "@napi-rs/canvas"
    ],
    
});


export {};
