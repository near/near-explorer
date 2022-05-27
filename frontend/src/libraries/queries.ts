import React from "react";
import * as ReactQuery from "react-query";
import { ParsedUrlQuery } from "querystring";
import { timeout } from "./common";
import { getFetcher } from "./transport";
import { getNearNetworkName } from "./config";
import { ProcedureArgs, ProcedureType } from "../types/common";
import { MINUTE } from "./time";

export const getProcedureKey = <P extends ProcedureType>(
  procedure: P,
  args: ProcedureArgs<P>
): ReactQuery.QueryKey => ["procedure", procedure, args];

export const createQueryClient = () =>
  new ReactQuery.QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: MINUTE,
      },
    },
  });

export const useClientQueryClient = (): ReactQuery.QueryClient => {
  return React.useState(createQueryClient)[0];
};

const SERVER_PREFETCH_TIMEOUT = 1000;

export const serverPrefetchTimeout = <T>(
  fn: () => Promise<T>
): (() => Promise<T>) => {
  return () => Promise.race([fn(), timeout<T>(SERVER_PREFETCH_TIMEOUT)]);
};

export const getPrefetchObject = (
  parsedQuery: ParsedUrlQuery,
  hostname?: string
) => {
  const queryClient = createQueryClient();
  return {
    prefetch: <P extends ProcedureType>(procedure: P, args: ProcedureArgs<P>) =>
      queryClient.prefetchQuery(
        getProcedureKey(procedure, args),
        serverPrefetchTimeout(() =>
          getFetcher(getNearNetworkName(parsedQuery, hostname))(procedure, args)
        )
      ),
    dehydrate: () => ReactQuery.dehydrate(queryClient),
  };
};
