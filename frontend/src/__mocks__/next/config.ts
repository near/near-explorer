import { NextConfig } from "next";
import type { ExplorerConfig, NearNetwork } from "../../libraries/config";

const nearNetworks: NearNetwork[] = [
  {
    name: "localhostnet",
    explorerLink: "http://localhost:3000",
    nearWalletProfilePrefix: "https://wallet.near.org/profile",
  },
];

const backendConfig = {
  host: "this-could-be-anything",
  port: 0,
  secure: false,
};
const config: ExplorerConfig & NextConfig = {
  publicRuntimeConfig: {
    nearNetworks,
    backendConfig,
    googleAnalytics: "",
  },
  serverRuntimeConfig: {
    backendConfig,
  },
};

export default () => config;
