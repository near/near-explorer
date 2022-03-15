import { NextConfig } from "next";
import type { ExplorerConfig, NearNetwork } from "../../libraries/config";

const nearNetworks: NearNetwork[] = [
  {
    name: "localhostnet",
    explorerLink: "http://localhost:3000",
    aliases: ["localhost:3000", "localhost", "127.0.0.1", "127.0.0.1:3000"],
    nearWalletProfilePrefix: "https://wallet.near.org/profile",
  },
];

const wampNearExplorerUrl = "ws://this-could-be-any-url/ws";
const config: ExplorerConfig & NextConfig = {
  publicRuntimeConfig: {
    nearNetworks,
    nearNetworkAliases: {
      "localhost:3000": nearNetworks[0],
      localhost: nearNetworks[0],
      "127.0.0.1": nearNetworks[0],
      "127.0.0.1:3000": nearNetworks[0],
    },
    wampNearExplorerUrl,
    googleAnalytics: process.env.NEAR_EXPLORER_GOOGLE_ANALYTICS,
  },
  serverRuntimeConfig: {
    wampNearExplorerUrl,
  },
};

export default () => config;
