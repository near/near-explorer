import * as React from "react";
import { NetworkContext } from "../context/NetworkContext";
import { NearNetwork } from "../libraries/config";
import { NetworkName } from "../types/common";

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
