import getNextConfig from "next/config";
import { ParsedUrlQuery } from "querystring";

export type NetworkName = "mainnet" | "testnet" | "guildnet" | "localhostnet";

export interface NearNetwork {
  name: NetworkName;
  explorerLink: string;
  aliases?: string[];
  nearWalletProfilePrefix: string;
}

export interface ExplorerConfig {
  serverRuntimeConfig: {
    wampNearExplorerUrl: string;
  };
  publicRuntimeConfig: {
    nearNetworks: NearNetwork[];
    wampNearExplorerUrl: string;
    googleAnalytics?: string;
  };
}

export const getConfig = (): ExplorerConfig => {
  return getNextConfig();
};

export function getNearNetwork(
  query: ParsedUrlQuery,
  hostname?: string
): NearNetwork {
  const config = getConfig();

  const queryNetwork = query.network;
  if (queryNetwork) {
    const matchedNetwork = config.publicRuntimeConfig.nearNetworks.find(
      (network) => network.name === queryNetwork
    );
    if (matchedNetwork) {
      return matchedNetwork;
    }
  }

  let nearNetwork: NearNetwork | undefined;
  if (hostname) {
    nearNetwork = config.publicRuntimeConfig.nearNetworks.find((network) =>
      network.aliases?.includes(hostname)
    );
  }
  if (!nearNetwork) {
    nearNetwork = config.publicRuntimeConfig.nearNetworks[0];
  }
  if (!nearNetwork) {
    throw new Error("No NEAR networks provided via NEAR_NETWORKS env variable");
  }
  return nearNetwork;
}
