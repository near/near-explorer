import { NextApiResponse } from "next";

import { NetworkName } from "@explorer/common/types/common";
import { getConfig } from "@explorer/frontend/libraries/config";

const {
  publicRuntimeConfig: { nearNetworks, googleAnalytics },
} = getConfig();

export const isNetworkOffline = (networkName: NetworkName): boolean => {
  const network = nearNetworks[networkName];
  if (!network) {
    return true;
  }
  return Boolean(network.offline);
};

export const respondNetworkOffline = (
  res: NextApiResponse,
  networkName: NetworkName
) => {
  res
    .status(404)
    .send(
      `Network "${networkName}" explorer is offline. If you believe it should go online please open an issue on github`
    );
};
