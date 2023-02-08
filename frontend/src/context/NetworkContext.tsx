import * as React from "react";

import { NetworkName } from "@explorer/common/types/common";
import { NearNetwork } from "@explorer/frontend/libraries/config";

export interface NetworkContextType {
  networkName: NetworkName;
  networks: Partial<Record<NetworkName, NearNetwork>>;
}

export const NetworkContext = React.createContext<
  NetworkContextType | undefined
>(undefined);
