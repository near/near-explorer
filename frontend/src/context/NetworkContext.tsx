import * as React from "react";

import { NetworkName } from "@/common/types/common";
import { NearNetwork } from "@/frontend/libraries/config";

export interface NetworkContextType {
  networkName: NetworkName;
  networks: Partial<Record<NetworkName, NearNetwork>>;
}

export const NetworkContext = React.createContext<
  NetworkContextType | undefined
>(undefined);
