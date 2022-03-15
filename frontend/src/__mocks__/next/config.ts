import { NextConfig } from "next";
import { ExplorerConfig, NearNetwork } from "../../libraries/config";

const isWampSecure = Boolean(process.env.WAMP_SECURE);
const wampHost = process.env.WAMP_HOST || "localhost";
const wampPort = process.env.WAMP_PORT || 10000;
const wampNearExplorerUrl = `${
  isWampSecure ? "wss" : "ws"
}://${wampHost}:${wampPort}/ws`;

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
    wampNearExplorerUrl,
    googleAnalytics: process.env.NEAR_EXPLORER_GOOGLE_ANALYTICS,
  },
  serverRuntimeConfig: {
    wampNearExplorerUrl,
  },
};

export default () => config;
