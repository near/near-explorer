import * as trpcClient from "@trpc/client";
import * as trpcReact from "@trpc/react-query";

import { NetworkName } from "@/common/types/common";
import type { AppRouter } from "@/common/types/trpc";
import { getBackendUrl } from "@/frontend/libraries/transport";

export const trpc = trpcReact.createTRPCReact<AppRouter>();

export const getLinks = (
  endpointUrl: string,
  wsUrl: string
): trpcClient.TRPCLink<AppRouter>[] => {
  if (typeof window === "undefined") {
    return [
      trpcClient.httpBatchLink({
        url: endpointUrl,
      }),
    ];
  }
  return [
    trpcClient.splitLink({
      condition: (op) => op.type === "subscription",
      true: trpcClient.wsLink({
        client: trpcClient.createWSClient({ url: wsUrl }),
      }),
      false: trpcClient.httpBatchLink({
        url: endpointUrl,
      }),
    }),
  ];
};

export const getTrpcClient = (networkName: NetworkName) =>
  trpcReact.createTRPCProxyClient<AppRouter>({
    links: getLinks(
      getBackendUrl(networkName, "http", true),
      getBackendUrl(networkName, "websocket", true)
    ),
  });
