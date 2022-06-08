import { NextConfig } from "next";
import type { ExplorerConfig } from "../../libraries/config";

const backendConfig = {
  hosts: { localnet: "this-could-be-anything" },
  port: 0,
  secure: false,
};
const config: ExplorerConfig & NextConfig = {
  publicRuntimeConfig: {
    nearNetworks: {},
    backendConfig,
    googleAnalytics: "",
  },
  serverRuntimeConfig: {
    backendConfig,
  },
};

export default () => config;
