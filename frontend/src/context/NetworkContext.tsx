import * as React from "react";
import { NearNetwork } from "../libraries/config";

export interface NetworkContext {
  currentNetwork: NearNetwork;
  networks: NearNetwork[];
}

export const NetworkContext = React.createContext<NetworkContext | undefined>(
  undefined
);
