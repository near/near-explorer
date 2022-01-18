import { createContext } from "react";
import { NearNetwork } from "../libraries/config";

export interface NetworkContext {
  currentNetwork: NearNetwork;
  networks: NearNetwork[];
}

export const NetworkContext = createContext<NetworkContext | undefined>(
  undefined
);
