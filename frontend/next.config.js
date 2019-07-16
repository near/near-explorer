// next.config.js
const withCSS = require("@zeit/next-css");

const defaultWampNearExplorerUrl = "ws://localhost:8080/ws";
const defaultWampNearExplorerFrontendSecret = "front";

module.exports = withCSS({
  webpack(config, options) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  },
  env: {
    WAMP_NEAR_EXPLORER_URL:
      process.env.WAMP_NEAR_EXPLORER_URL ||
      defaultWampNearExplorerUrl,
    WAMP_NEAR_EXPLORER_FRONTEND_SECRET:
      process.env.WAMP_NEAR_EXPLORER_FRONTEND_SECRET ||
      defaultWampNearExplorerFrontendSecret
  },
});
