import * as React from "react";

import { NetworkName } from "@/common/types/common";
import { NetworkContext } from "@/frontend/context/NetworkContext";
import { NearNetwork } from "@/frontend/libraries/config";

export const useNetworkContext = (): {
  networkName: NetworkName;
  network?: NearNetwork;
  networks: [NetworkName, NearNetwork][];
} => {
  const networkContext = React.useContext(NetworkContext);
  if (!networkContext) {
    throw new Error("Expected to have NEAR network context");
  }
  const networks = Object.entries(networkContext.networks) as [
    NetworkName,
    NearNetwork
  ][];
  return {
    network: networkContext.networks[networkContext.networkName],
    networkName: networkContext.networkName,
    networks,
  };
};
