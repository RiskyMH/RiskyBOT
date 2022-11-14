/** @type {import("next").NextConfig} */
module.exports = {
    // basePath: "RiskyBOT",
    // assetPrefix: process.env.CF_PAGES_URL || process.env.PAGES_URL
    reactStrictMode: false,
    // trailingSlash: true,
}

const withTM = require('next-transpile-modules')(['react-discord-components-mockup']); // pass the modules you would like to see transpiled
module.exports = withTM(module.exports);
// module.exports = config;

