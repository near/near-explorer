import { NextConfig } from "next";

import type { ExplorerConfig } from "@/frontend/libraries/config";

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
    segmentWriteKey: "",
    gleapKey: undefined,
  },
  serverRuntimeConfig: {
    backendConfig,
    offline: false,
  },
};

export default () => config;
