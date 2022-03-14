import * as React from "react";
import { NetworkContext } from "../context/NetworkContext";

export const useNetworkContext = (): NetworkContext => {
  const networkContext = React.useContext(NetworkContext);
  if (!networkContext) {
    throw new Error("Expected to have NEAR network context");
  }
  return networkContext;
};
