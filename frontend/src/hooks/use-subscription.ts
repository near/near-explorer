import * as React from "react";

import * as ReactQuery from "react-query";

import { StableOmit } from "@explorer/common/types/common";
import {
  TRPCError,
  TRPCSubscriptionInputs,
  TRPCSubscriptionKey,
  TRPCSubscriptionOutput,
} from "@explorer/common/types/trpc";
import { subscribe } from "@explorer/frontend/libraries/subscriptions";
import { trpc } from "@explorer/frontend/libraries/trpc";

export type UseSubscriptionResult<R> = StableOmit<
  ReactQuery.QueryObserverResult<R, TRPCError>,
  | "isStale"
  | "isPlaceholderData"
  | "isPreviousData"
  | "isFetched"
  | "isFetchedAfterMount"
  | "isFetching"
  | "isRefetching"
  | "failureCount"
  | "errorUpdateCount"
  | "refetch"
  | "remove"
>;

export type UseSubscriptionResultByTopic<
  TPath extends TRPCSubscriptionKey & string
> = UseSubscriptionResult<TRPCSubscriptionOutput<TPath>>;

const useSubscriptionClient = <TPath extends TRPCSubscriptionKey & string>(
  pathAndInput: [path: TPath, ...args: TRPCSubscriptionInputs<TPath>],
  opts?: {
    enabled?: boolean;
  }
): UseSubscriptionResultByTopic<TPath> => {
  const enabled = opts?.enabled ?? true;
  const queryKey = ReactQuery.hashQueryKey(pathAndInput);
  const trpcContext = trpc.useContext();

  // We're getting prefetched and dehydrated data from query (see above)
  const cachedData = trpcContext.getQueryData(
    pathAndInput as any
  ) as TRPCSubscriptionOutput<TPath>;
  const [value, setValue] = React.useState<
    TRPCSubscriptionOutput<TPath> | undefined
  >(() => cachedData);
  const [dataUpdatedAt, setDataUpdatedAt] = React.useState(0);
  const [errorUpdatedAt, setErrorUpdatedAt] = React.useState(0);
  const [loading, setLoading] = React.useState(() => !cachedData);
  const [error, setError] = React.useState<TRPCError | null>(null);
  React.useEffect(() => {
    if (!enabled) {
      return;
    }
    return subscribe(trpcContext.client, pathAndInput, [
      (nextValue) => {
        setLoading(false);
        setError(null);
        setValue(nextValue);
        setDataUpdatedAt(Date.now());
      },
      (subscriptionError) => {
        setLoading(false);
        setError(subscriptionError);
        setErrorUpdatedAt(Date.now());
      },
    ]);
    // queryKey substitutes pathAndInput here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey, enabled, trpcContext.client]);
  const base = {
    dataUpdatedAt,
    errorUpdatedAt,
  };
  if (loading) {
    return {
      ...base,
      data: undefined,
      error: null,
      isError: false,
      isIdle: false,
      isLoading: true,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: false,
      status: "loading",
    };
  }
  if (error !== null) {
    if (value !== undefined) {
      return {
        ...base,
        data: value,
        error,
        isError: true,
        isIdle: false,
        isLoading: false,
        isLoadingError: false,
        isRefetchError: true,
        isSuccess: false,
        status: "error",
      };
    }
    return {
      ...base,
      data: undefined,
      error,
      isError: true,
      isIdle: false,
      isLoading: false,
      isLoadingError: true,
      isRefetchError: false,
      isSuccess: false,
      status: "error",
    };
  }
  if (value !== undefined) {
    return {
      ...base,
      data: value,
      error: null,
      isError: false,
      isIdle: false,
      isLoading: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
      status: "success",
    };
  }
  return {
    ...base,
    data: undefined,
    error: null,
    isError: false,
    isIdle: true,
    isLoading: false,
    isLoadingError: false,
    isRefetchError: false,
    isSuccess: false,
    status: "idle",
  };
};

export const useSubscription = <TPath extends TRPCSubscriptionKey & string>(
  pathAndInput: [path: TPath, ...args: TRPCSubscriptionInputs<TPath>],
  opts: {
    enabled?: boolean;
  } = {}
): UseSubscriptionResultByTopic<TPath> => {
  if (typeof window === "undefined") {
    // A hack to prefetch data from subscriptions for SSR
    // @ts-ignore
    return trpc.useQuery(pathAndInput, opts);
  }
  return useSubscriptionClient(pathAndInput, opts);
};
