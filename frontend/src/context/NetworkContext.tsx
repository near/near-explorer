import * as React from "react";
import { NearNetwork } from "@explorer/frontend/libraries/config";
import { NetworkName } from "@explorer/common/types/common";

export interface NetworkContext {
  networkName: NetworkName;
  networks: Partial<Record<NetworkName, NearNetwork>>;
}

export const NetworkContext = React.createContext<NetworkContext | undefined>(
  undefined
);
