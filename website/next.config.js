/** @type {import("next").NextConfig} */
const config = {
    // basePath: "RiskyBOT",
    // assetPrefix: process.env.CF_PAGES_URL || process.env.PAGES_URL
    reactStrictMode: false,
    // trailingSlash: true,
}


const withTM = require('next-transpile-modules')(['react-discord-components-mockup']); // pass the modules you would like to see transpiled

module.exports = withTM(config);
// module.exports = config;