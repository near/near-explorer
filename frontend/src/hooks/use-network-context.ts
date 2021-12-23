import { useContext } from "react";
import { NetworkContext } from "../context/NetworkContext";

export const useNetworkContext = (): NetworkContext => {
  const networkContext = useContext(NetworkContext);
  if (!networkContext) {
    throw new Error("Expected to have NEAR network context");
  }
  return networkContext;
};
