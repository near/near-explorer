import { NextConfig } from "next";
import {
  BackendConfig,
  ExplorerConfig,
  NearNetwork,
} from "./src/libraries/config";
import { merge } from "lodash";
import { getOverrides } from "../backend/src/environment";

const defaultBackendConfig: BackendConfig = {
  host: "localhost",
  port: 10000,
  secure: false,
};

const config = merge(
  {
    backendConfig: defaultBackendConfig,
    backendConfigSsr: defaultBackendConfig,
    networks: [
      {
        name: "localhostnet",
        explorerLink: "http://localhost:3000",
        nearWalletProfilePrefix: "https://wallet.near.org/profile",
      },
    ] as NearNetwork[],
    googleAnalytics: undefined,
  },
  getOverrides("NEAR_EXPLORER_CONFIG")
);

const nextConfig: ExplorerConfig & NextConfig = {
  serverRuntimeConfig: {
    backendConfig: config.backendConfigSsr,
  },
  publicRuntimeConfig: {
    nearNetworks: config.networks,
    backendConfig: config.backendConfig,
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
};

export = nextConfig;
