import * as trpcReact from "@trpc/react";
import { AppRouter, NetworkName } from "../types/common";
import { getBackendUrl } from "./transport";

export const trpc = trpcReact.createReactQueryHooks<AppRouter>();

export const getTrpcClient = (networkName: NetworkName) =>
  trpc.createClient({
    url: getBackendUrl(networkName, "http"),
  });
