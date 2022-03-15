import { IncomingMessage } from "http";
import getNextConfig from "next/config";

export type NetworkName = "mainnet" | "testnet" | "guildnet" | "localhostnet";

export interface NearNetwork {
  name: NetworkName;
  explorerLink: string;
  aliases: string[];
  nearWalletProfilePrefix: string;
}

export interface ExplorerConfig {
  serverRuntimeConfig: {
    wampNearExplorerUrl: string;
  };
  publicRuntimeConfig: {
    nearNetworks: NearNetwork[];
    nearNetworkAliases: Record<string, NearNetwork>;
    wampNearExplorerUrl: string;
    googleAnalytics?: string;
  };
}

export const getConfig = (): ExplorerConfig => {
  return getNextConfig();
};

function getHostname(req?: IncomingMessage): string | undefined {
  if (typeof window !== "undefined") {
    return window.location.host;
  } else if (req) {
    return req.headers.host;
  }
}

export function getNearNetwork(req?: IncomingMessage): NearNetwork {
  const config = getConfig();
  const hostname = getHostname(req);
  let nearNetwork = hostname
    ? config.publicRuntimeConfig.nearNetworkAliases[hostname]
    : undefined;
  if (nearNetwork === undefined) {
    nearNetwork = config.publicRuntimeConfig.nearNetworks[0];
    if (!nearNetwork) {
      throw new Error(
        "No NEAR networks provided via NEAR_NETWORKS env variable"
      );
    }
  }
  return nearNetwork;
}

export const getWampNearExplorerUrl = (): string => {
  const isWampSecure = process.env.NEAR_EXPLORER_WAMP_SECURE === "true";
  const wampHost = process.env.NEAR_EXPLORER_WAMP_HOST || "localhost";
  const wampPort = process.env.NEAR_EXPLORER_WAMP_PORT || 10000;
  return `${isWampSecure ? "wss" : "ws"}://${wampHost}:${wampPort}/ws`;
};
