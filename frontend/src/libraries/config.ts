import getNextConfig from "next/config";
import { ParsedUrlQuery } from "querystring";
import { NetworkName } from "../types/common";

export interface NearNetwork {
  explorerLink: string;
  aliases?: string[];
  nearWalletProfilePrefix: string;
}

export type BackendConfig = {
  hosts: Partial<Record<NetworkName, string>>;
  port: number;
  secure: boolean;
};

export interface ExplorerConfig {
  serverRuntimeConfig: {
    backendConfig: BackendConfig;
  };
  publicRuntimeConfig: {
    nearNetworks: Partial<Record<NetworkName, NearNetwork>>;
    backendConfig: BackendConfig;
    googleAnalytics?: string;
  };
}

export const getConfig = (): ExplorerConfig => {
  return getNextConfig();
};

export function getNearNetworkName(
  query: ParsedUrlQuery,
  hostname?: string
): NetworkName {
  const config = getConfig();
  const networkEntries = Object.entries(
    config.publicRuntimeConfig.nearNetworks
  ) as [NetworkName, NearNetwork][];

  const queryNetwork = Array.isArray(query.network)
    ? query.network[0]
    : query.network;
  if (queryNetwork) {
    const matchedNetwork = networkEntries.find(
      ([networkName]) => networkName === queryNetwork
    );
    if (matchedNetwork) {
      return matchedNetwork[0];
    }
  }

  let networkName: NetworkName | undefined;
  if (hostname) {
    networkName = networkEntries.find(([, network]) =>
      network.aliases?.includes(hostname)
    )?.[0];
  }
  if (!networkName) {
    networkName = networkEntries[0][0];
  }
  if (!networkName) {
    throw new Error(
      "No NEAR networks provided via NEAR_EXPLORER_CONFIG__NETWORKS env variable"
    );
  }
  return networkName;
}
