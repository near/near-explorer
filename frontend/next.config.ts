import { NextConfig } from "next";
import {
  BackendConfig,
  ExplorerConfig,
  NearNetwork,
} from "./src/libraries/config";

const getWampHost = (isServer: boolean): string => {
  const wampHost = process.env.NEAR_EXPLORER_WAMP_HOST || "localhost";
  if (isServer) {
    return process.env.NEAR_EXPLORER_WAMP_SSR_HOST || wampHost;
  }
  return wampHost;
};

const getWampPort = (isServer: boolean): number => {
  const wampPort = Number(process.env.NEAR_EXPLORER_WAMP_PORT);
  const wampPortNumber = isNaN(wampPort) ? 10000 : wampPort;
  if (isServer) {
    const wampSsrPort = Number(process.env.NEAR_EXPLORER_WAMP_SSR_PORT);
    const wampSsrPortNumber = isNaN(wampSsrPort) ? undefined : wampSsrPort;
    return wampSsrPortNumber || wampPortNumber;
  }
  return wampPortNumber;
};

const getWampSecure = (isServer: boolean): boolean => {
  if (isServer && process.env.NEAR_EXPLORER_WAMP_SSR_SECURE) {
    return process.env.NEAR_EXPLORER_WAMP_SSR_SECURE === "true";
  }
  return process.env.NEAR_EXPLORER_WAMP_SECURE === "true";
};

const getBackendConfig = (isServer: boolean): BackendConfig => {
  return {
    host: getWampHost(isServer),
    port: getWampPort(isServer),
    secure: getWampSecure(isServer),
  };
};

let nearNetworks: NearNetwork[];
if (process.env.NEAR_NETWORKS) {
  nearNetworks = JSON.parse(process.env.NEAR_NETWORKS);
} else {
  nearNetworks = [
    {
      name: "localhostnet",
      explorerLink: "http://localhost:3000",
      nearWalletProfilePrefix: "https://wallet.near.org/profile",
    },
  ];
}

const config: ExplorerConfig & NextConfig = {
  serverRuntimeConfig: {
    backendConfig: getBackendConfig(true),
  },
  publicRuntimeConfig: {
    nearNetworks,
    backendConfig: getBackendConfig(false),
    googleAnalytics: process.env.NEAR_EXPLORER_GOOGLE_ANALYTICS,
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

export = config;
