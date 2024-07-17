import { renameSync } from "fs";


// some packages should get `sideEffects: false` in their package.json forcefully
const sideEffectsFalse = [
    "lilybird"
];

for (const pkg of sideEffectsFalse) {
    const pkgPath = "../../node_modules/" + pkg + "/package.json";
    // @ts-expect-error somehow types got removed
    const pkgJson = await Bun.file(pkgPath).json();
    pkgJson.sideEffects = false;
    await Bun.write(pkgPath, JSON.stringify(pkgJson, null, 2));
}

// Actually build the files
const nodeBuild = await Bun.build({
    entrypoints: [
        "./src/api/[bot].ts",
    ],
    target: "bun",
    outdir: "./.vercel/output/functions/api/[bot].func",
    // sourcemap: "inline",
    splitting: true,
    external: ["@napi-rs/canvas-*"],
    format: "esm",
});

if (!nodeBuild.success) {
    console.log(nodeBuild);
    throw nodeBuild.logs;
}

console.log(Bun.version, Bun.revision);

const NODE_FIX = "import { createRequire as createImportMetaRequire } from \"module\"; import.meta.require ||= (id) => createImportMetaRequire(import.meta.url)(id);\n";
// Write output files
for (const result of nodeBuild.outputs) {
    if (result.path.endsWith(".js")) {
        const fileContent = ("console.time('init');\n" + NODE_FIX + await result.text() + "\nconsole.timeEnd('init');\n")
            .replaceAll("(0, eval)", "eval");

        await Bun.write(result.path, fileContent);
    }
}


//? ///////////////////////////// ?//
//        Vercel build             //
//---------------------------------//
const baseOutput = "./.vercel/output";
const baseApiFunc = baseOutput + "/functions/api/[bot].func";

// rename the file to .mjs
renameSync(`${baseApiFunc}/[bot].js`, `${baseApiFunc}/[bot].mjs`);

// copy @napi-rs node_modules folder into "./.vercel/output/functions/api/[bot].func/"
const glob = new Bun.Glob("@napi-rs/**/*{.node,package.json}");
for await (const entry of glob.scan("../../node_modules")) {
    if (!entry.startsWith("@napi-rs/canvas-")) continue;
    await Bun.write(`${baseApiFunc}/node_modules/${entry}`, Bun.file("../../node_modules/" + entry));
}

// copy public into .vercel/output/static
for await (const entry of new Bun.Glob("*").scan("./public")) {
    await Bun.write(`${baseOutput}/static/${entry}`, Bun.file("./public/" + entry));
}

// make other files for vercel build
const files = {
    [`${baseApiFunc}/.vc-config.json`]: JSON.stringify({
        runtime: "nodejs20.x",
        handler: "[bot].mjs",
        launcherType: "Nodejs",
        shouldAddHelpers: true
    }),
    [`${baseOutput}/config.json`]: JSON.stringify({
        version: 3,
        routes: [
            {
                handle: "filesystem"
            },
            {
                src: "^/api/([^/]+)$",
                dest: "/api/[bot]?bot=$1",
                check: true
            },
            {
                src: "^/api(/.*)?$",
                status: 404
            },
            {
                handle: "error"
            },
            {
                status: 404,
                src: "^(?!/api).*$",
                dest: "/404.html"
            },
            {
                handle: "miss"
            },
            {
                src: "^/api/(.+)(?:\\.(?:js))$",
                dest: "/api/$1",
                check: true
            }
        ],

    }),
};

for (const [path, content] of Object.entries(files)) {
    await Bun.write(path, content);
}

export { };

console.info("Built!");
