import * as trpcReact from "@trpc/react";

import { NetworkName } from "@explorer/common/types/common";
import type { AppRouter } from "@explorer/common/types/trpc";
import { getBackendUrl } from "@explorer/frontend/libraries/transport";

export const trpc = trpcReact.createReactQueryHooks<AppRouter>();

export const getTrpcClient = (networkName: NetworkName) =>
  trpc.createClient({
    url: getBackendUrl(networkName, "http", typeof window === "undefined"),
  });
