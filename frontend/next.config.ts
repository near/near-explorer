import { NextConfig } from "next";
import {
  ExplorerConfig,
  getWampNearExplorerUrl,
  NearNetwork,
} from "./src/libraries/config";

let nearNetworks: NearNetwork[];
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
const nearNetworkAliases: Record<string, NearNetwork> = {};
for (const nearNetwork of nearNetworks) {
  for (const alias of nearNetwork.aliases) {
    nearNetworkAliases[alias] = nearNetwork;
  }
}

const wampNearExplorerUrl = getWampNearExplorerUrl();
const config: ExplorerConfig & NextConfig = {
  serverRuntimeConfig: {
    wampNearExplorerUrl,
  },
  publicRuntimeConfig: {
    nearNetworks,
    nearNetworkAliases,
    wampNearExplorerUrl,
    googleAnalytics: process.env.NEAR_EXPLORER_GOOGLE_ANALYTICS,
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export = config;
