import { IncomingMessage } from "http";
import { ExplorerConfig, NearNetwork } from "next.config";
import getConfig from "next/config";

const {
  publicRuntimeConfig: { nearNetworks, nearNetworkAliases },
} = getConfig() as ExplorerConfig;

function getHostname(req?: IncomingMessage): string | undefined {
  if (typeof window !== "undefined") {
    return window.location.host;
  } else if (req) {
    return req.headers.host;
  }
}

export function getNearNetwork(req?: IncomingMessage): NearNetwork {
  const hostname = getHostname(req);
  let nearNetwork = hostname ? nearNetworkAliases[hostname] : undefined;
  if (nearNetwork === undefined) {
    nearNetwork = nearNetworks[0];
    if (!nearNetwork) {
      throw new Error(
        "No NEAR networks provided via NEAR_NETWORKS env variable"
      );
    }
  }
  return nearNetwork;
}
