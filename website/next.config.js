/** @type {import("next").NextConfig} */
const nextConfig = {
    // basePath: "RiskyBOT",
    // assetPrefix: process.env.CF_PAGES_URL || process.env.PAGES_URL
    reactStrictMode: true,
    // trailingSlash: true,
    transpilePackages: [
        'react-discord-components-mockup'
    ],
};

module.exports = nextConfig;

