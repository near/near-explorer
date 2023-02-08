import * as React from "react";

import { NetworkName } from "@explorer/common/types/common";
import { NearNetwork } from "@explorer/frontend/libraries/config";

export interface NetworkContext {
  networkName: NetworkName;
  networks: Partial<Record<NetworkName, NearNetwork>>;
}

export const NetworkContext = React.createContext<NetworkContext | undefined>(
  undefined
);
