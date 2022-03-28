import * as ReactQuery from "react-query";
import { timeout } from "./promise";

export const createServerQueryClient = (): ReactQuery.QueryClient => {
  return new ReactQuery.QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
      },
    },
  });
};

export const SERVER_PREFETCH_TIMEOUT = 1000;

export const serverPrefetchTimeout = <T>(
  fn: () => Promise<T>
): (() => Promise<T>) => {
  return () => Promise.race([fn(), timeout<T>(SERVER_PREFETCH_TIMEOUT)]);
};
