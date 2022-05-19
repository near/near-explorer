import { NextConfig } from "next";
import {
  BackendConfig,
  ExplorerConfig,
  NearNetwork,
} from "./src/libraries/config";
import { merge } from "lodash";
import { getOverrides } from "./src/libraries/common";
import { NetworkName } from "./src/types/common";

const defaultBackendConfig: BackendConfig = {
  hosts: {
    mainnet: "localhost",
    testnet: "localhost",
    guildnet: "localhost",
    localhostnet: "localhost",
  },
  port: 10000,
  secure: false,
};

const config = merge(
  {
    backend: defaultBackendConfig,
    backendSsr: defaultBackendConfig,
    networks: {} as Partial<Record<NetworkName, NearNetwork>>,
    googleAnalytics: undefined,
  },
  getOverrides("NEAR_EXPLORER_CONFIG")
);

const nextConfig: ExplorerConfig & NextConfig = {
  serverRuntimeConfig: {
    backendConfig: config.backendSsr,
  },
  publicRuntimeConfig: {
    nearNetworks: config.networks,
    backendConfig: config.backend,
    googleAnalytics: config.googleAnalytics,
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        child_process: false,
      };
    }
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  experimental: {
    externalDir: true,
  },
};

export = nextConfig;
