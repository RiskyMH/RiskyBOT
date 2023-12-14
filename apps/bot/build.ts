const nodeBuild = await Bun.build({
    entrypoints: [
        "./src/api/[bot].ts",
    ],
    target: "bun",
    outdir: "./api",
    // sourcemap: "inline",
    splitting: true,
    // minify: true,
    external: ["@napi-rs/canvas"],
        
});

if (!nodeBuild.success) {
    throw nodeBuild;
}

const NODE_FIX = "import { createRequire as createImportMetaRequire } from \"module\"; import.meta.require ||= (id) => createImportMetaRequire(import.meta.url)(id);\n";
// const BUILD_DIR = "build";


// Write output files
for (const result of nodeBuild.outputs) {
    if (!result.path.endsWith(".js")) continue;
    const fileContent = (NODE_FIX + await result.text())
        .replace("(0, eval)", "eval");
    Bun.write(result.path, fileContent);
    console.log(fileContent.length)
}

export {};