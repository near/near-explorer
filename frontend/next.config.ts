import type { NextConfig } from "next";
import path from "path";
import type {
  BackendConfig,
  ExplorerConfig,
  NearNetwork,
} from "./src/libraries/config";
import { merge, cloneDeep } from "lodash";
import { getOverrides } from "./src/libraries/common";
import type { NetworkName } from "./src/types/common";
// @ts-ignore
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const statsOptions = {
  baseDir: "stats",
  enabled: Boolean(process.env.STATS),
  openAnalyzer: Boolean(process.env.OPEN_ANALYZER),
};

const defaultBackendConfig: BackendConfig = {
  hosts: {
    mainnet: "localhost",
    testnet: "localhost",
    shardnet: "localhost",
    guildnet: "localhost",
    localnet: "localhost",
  },
  port: 10000,
  secure: false,
};

const config = merge(
  {
    backend: cloneDeep(defaultBackendConfig),
    backendSsr: cloneDeep(defaultBackendConfig),
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
    if (statsOptions.enabled) {
      config.plugins.push(
        // Analyzer with foam plot
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: statsOptions.openAnalyzer,
          reportFilename: isServer
            ? path.join(statsOptions.baseDir, "./server.html")
            : path.join(statsOptions.baseDir, "./client.html"),
          generateStatsFile: true,
        })
      );
    }

    return config;
  },
  experimental: {
    externalDir: true,
  },
  images: {
    domains: ["cloudflare-ipfs.com", "ipfs.fleek.co"],
  },
};

export = nextConfig;
