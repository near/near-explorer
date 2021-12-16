import { ExplorerConfig, NearNetwork } from "next.config";
import getConfig from "next/config";

const {
  publicRuntimeConfig: { nearNetworks, nearNetworkAliases },
} = getConfig() as ExplorerConfig;

export function getNearNetwork(hostname: string): NearNetwork {
  let nearNetwork = nearNetworkAliases[hostname];
  if (nearNetwork === undefined) {
    nearNetwork = nearNetworks[0];
  }
  return nearNetwork;
}
