// next.config.js
const withCSS = require("@zeit/next-css");

const defaultWampNearExplorerUrl = "ws://localhost:8080/ws";

module.exports = withCSS({
  serverRuntimeConfig: {
    wampNearExplorerUrl:
      process.env.WAMP_NEAR_EXPLORER_INTERNAL_URL ||
      process.env.WAMP_NEAR_EXPLORER_URL ||
      defaultWampNearExplorerUrl
  },
  publicRuntimeConfig: {
    wampNearExplorerUrl:
      process.env.WAMP_NEAR_EXPLORER_URL || defaultWampNearExplorerUrl,
    googleAnalytics: process.env.NEAR_EXPLORER_GOOGLE_ANALYTICS
  }
});
