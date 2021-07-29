// next.config.js
//
// NOTE: Make sure you update `src/__mocks__/next/config.js` when change this file!
//
const { DATA_SOURCE_TYPE } = require("./src/libraries/consts.js");

const defaultWampNearExplorerUrl = "ws://localhost:8080/ws";

let nearNetworks;
if (process.env.NEAR_NETWORKS) {
  nearNetworks = JSON.parse(process.env.NEAR_NETWORKS);
} else {
  nearNetworks = [
    {
      name: "localhostnet",
      explorerLink: "http://localhost:3000",
      aliases: ["localhost:3000", "localhost", "127.0.0.1", "127.0.0.1:3000"],
      nearWalletProfilePrefix: "https://wallet.near.org/profile",
    },
  ];
}
const nearNetworkAliases = {};
for (const nearNetwork of nearNetworks) {
  for (const alias of nearNetwork.aliases) {
    nearNetworkAliases[alias] = nearNetwork;
  }
}

module.exports = {
  serverRuntimeConfig: {
    wampNearExplorerUrl:
      process.env.WAMP_NEAR_EXPLORER_INTERNAL_URL ||
      process.env.WAMP_NEAR_EXPLORER_URL ||
      defaultWampNearExplorerUrl,
  },
  publicRuntimeConfig: {
    nearNetworks,
    nearNetworkAliases,
    nearExplorerDataSource:
      process.env.NEAR_EXPLORER_DATA_SOURCE ||
      DATA_SOURCE_TYPE.LEGACY_SYNC_BACKEND,
    wampNearExplorerUrl:
      process.env.WAMP_NEAR_EXPLORER_URL || defaultWampNearExplorerUrl,
    googleAnalytics: process.env.NEAR_EXPLORER_GOOGLE_ANALYTICS,
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: "empty",
      };
    }

    return config;
  },
  webpack5: false,
};
