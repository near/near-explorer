import { IncomingMessage } from "http";
import getNextConfig from "next/config";
import { NetworkName } from "./wamp/types";

export interface NearNetwork {
  name: NetworkName;
  explorerLink: string;
  aliases: string[];
  nearWalletProfilePrefix: string;
}

export type BackendConfig = {
  host: string;
  port: string;
  secure: boolean;
};

export interface ExplorerConfig {
  serverRuntimeConfig: {
    backendConfig: BackendConfig;
  };
  publicRuntimeConfig: {
    nearNetworks: NearNetwork[];
    nearNetworkAliases: Record<string, NearNetwork>;
    backendConfig: BackendConfig;
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
