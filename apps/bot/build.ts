import { cpSync, renameSync } from "fs";

const nodeBuild = await Bun.build({
    entrypoints: [
        "./src/api/[bot].ts",
    ],
    target: "bun",
    outdir: "./.vercel/output/functions/api/[bot].func",
    // sourcemap: "inline",
    splitting: true,
    // minify: true,
    external: ["@napi-rs*"],
});

if (!nodeBuild.success) {
    throw nodeBuild;
}

const NODE_FIX = "import { createRequire as createImportMetaRequire } from \"module\"; import.meta.require ||= (id) => createImportMetaRequire(import.meta.url)(id);\n";
// Write output files
for (const result of nodeBuild.outputs) {
    if (result.path.endsWith(".js")) {
        const fileContent = (NODE_FIX + await result.text())
            .replaceAll("(0, eval)", "eval")

        await Bun.write(result.path, fileContent);
        console.log(fileContent.length);

    }
}

// rename the file to .mjs
renameSync("./.vercel/output/functions/api/[bot].func/[bot].js", "./.vercel/output/functions/api/[bot].func/[bot].mjs");

// copy @napi-rs node_modules folder into "./.vercel/output/functions/api/[bot].func/"
cpSync("../../node_modules/@napi-rs", "./.vercel/output/functions/api/[bot].func/node_modules/@napi-rs", { recursive: true });

// make other files for vercel build
const files = {
    "./.vercel/output/functions/api/[bot].func/.vc-config.json": JSON.stringify({
        "runtime": "nodejs18.x",
        "handler": "[bot].mjs",
        "launcherType": "Nodejs",
        "shouldAddHelpers": true
    }),
    "./.vercel/output/config.json": JSON.stringify({
        version: 3,
        "routes": [
            {
                "handle": "filesystem"
            },
            {
                "src": "^/api/([^/]+)$",
                "dest": "/api/[bot]?bot=$1",
                "check": true
            },
            {
                "src": "^/api(/.*)?$",
                "status": 404
            },
            {
                "handle": "error"
            },
            {
                "status": 404,
                "src": "^(?!/api).*$",
                "dest": "/404.html"
            },
            {
                "handle": "miss"
            },
            {
                "src": "^/api/(.+)(?:\\.(?:js))$",
                "dest": "/api/$1",
                "check": true
            }
        ],

    }),
};

for (const [path, content] of Object.entries(files)) {
    await Bun.write(path, content);
}

export { };