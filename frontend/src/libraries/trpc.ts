import * as trpcReact from "@trpc/react";
import type { AppRouter } from "@explorer/common/types/trpc";
import { NetworkName } from "@explorer/common/types/common";
import { getBackendUrl } from "@explorer/frontend/libraries/transport";

export const trpc = trpcReact.createReactQueryHooks<AppRouter>();

export const getTrpcClient = (networkName: NetworkName) =>
  trpc.createClient({
    url: getBackendUrl(networkName, "http", typeof window === "undefined"),
  });
