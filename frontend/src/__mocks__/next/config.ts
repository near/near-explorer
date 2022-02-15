import { NextConfig } from "next";
import { ExplorerConfig, NearNetwork } from "../../libraries/config";

const defaultWampNearExplorerUrl = "ws://localhost:8080/ws";
const nearNetworks: NearNetwork[] = [
  {
    name: "localhostnet",
    explorerLink: "http://localhost:3000",
    aliases: ["localhost:3000", "localhost", "127.0.0.1", "127.0.0.1:3000"],
    nearWalletProfilePrefix: "https://wallet.near.org/profile",
  },
];

const config: ExplorerConfig & NextConfig = {
  publicRuntimeConfig: {
    nearNetworks,
    nearNetworkAliases: {
      "localhost:3000": nearNetworks[0],
      localhost: nearNetworks[0],
      "127.0.0.1": nearNetworks[0],
      "127.0.0.1:3000": nearNetworks[0],
    },
    nearExplorerDataSource: "unknown",
    wampNearExplorerUrl:
      process.env.WAMP_NEAR_EXPLORER_URL || defaultWampNearExplorerUrl,
    googleAnalytics: process.env.NEAR_EXPLORER_GOOGLE_ANALYTICS,
  },
  serverRuntimeConfig: {
    wampNearExplorerUrl:
      process.env.WAMP_NEAR_EXPLORER_URL || defaultWampNearExplorerUrl,
  },
};

export default () => config;
