import { NearNetwork } from "next.config";
import { useContext } from "react";
import { NetworkContext } from "src/context/NetworkProvider";

export const useNearNetwork = (): {
  currentNetwork: NearNetwork;
  networks: NearNetwork[];
} => {
  const networkContext = useContext(NetworkContext);
  const currentNearNetwork = networkContext.currentNearNetwork;
  if (!currentNearNetwork) {
    throw new Error("Expected to have currentNearNetwork");
  }
  return {
    currentNetwork: currentNearNetwork,
    networks: networkContext.nearNetworks || [],
  };
};
