import { NextConfig } from "next";
import { ExplorerConfig, NearNetwork } from "./src/libraries/config";

const defaultWampNearExplorerUrl = "ws://localhost:8080/ws";

enum DataSource {
  LegacySyncBackend = "LEGACY_SYNC_BACKEND",
}

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

const config: ExplorerConfig & NextConfig = {
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
      process.env.NEAR_EXPLORER_DATA_SOURCE || DataSource.LegacySyncBackend,
    wampNearExplorerUrl:
      process.env.WAMP_NEAR_EXPLORER_URL || defaultWampNearExplorerUrl,
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
  experimental: {
    // Turning feature on breaks production code (with ESM module imported, e.g. stitches)
    // https://github.com/vercel/next.js/issues/32360
    esmExternals: false,
  },
};

export = config;
