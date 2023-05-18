import * as trpcReact from "@trpc/react";

import { NetworkName } from "@/common/types/common";
import type { AppRouter } from "@/common/types/trpc";
import { getBackendUrl } from "@/frontend/libraries/transport";

export const trpc = trpcReact.createReactQueryHooks<AppRouter>();

export const getTrpcClient = (networkName: NetworkName) =>
  trpc.createClient({
    url: getBackendUrl(networkName, "http", typeof window === "undefined"),
  });
