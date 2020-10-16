import getConfig from "next/config";

const {
  publicRuntimeConfig: { nearNetworks, nearNetworkAliases },
} = getConfig();

export interface NearNetwork {
  name: string;
  explorerLink: string;
  aliases: [string];
  lockupAccountIdSuffix: string;
}

export function getNearNetwork(hostname: string): NearNetwork {
  let nearNetwork = nearNetworkAliases[hostname];
  if (nearNetwork === undefined) {
    nearNetwork = nearNetworks[0];
  }
  return nearNetwork;
}
