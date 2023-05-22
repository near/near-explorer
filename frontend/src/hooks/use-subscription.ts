import * as React from "react";

import * as ReactQuery from "@tanstack/react-query";
import { createRecursiveProxy } from "@trpc/server/shared";

import { StableOmit } from "@/common/types/common";
import {
  TRPCError,
  TRPCSubscriptionInput,
  TRPCSubscriptionKey,
  TRPCSubscriptionOutput,
} from "@/common/types/trpc";
import { noop } from "@/common/utils/utils";
import {
  TRPCShortSubscriptionKey,
  getSubscriber,
} from "@/frontend/libraries/subscriptions";
import { trpc } from "@/frontend/libraries/trpc";

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
> & {
  refetch: () => void;
};

type SubscriptionOpts = {
  enabled?: boolean;
};

export type UseSubscriptionResultByTopic<
  TPath extends TRPCSubscriptionKey & string
> = UseSubscriptionResult<TRPCSubscriptionOutput<TPath>>;

const useSubscriptionClient = <K extends TRPCShortSubscriptionKey>(
  key: K,
  input: TRPCSubscriptionInput<`subscriptions.${K}`>,
  opts?: SubscriptionOpts
): UseSubscriptionResultByTopic<`subscriptions.${K}`> => {
  const enabled = opts?.enabled ?? true;
  const trpcContext = trpc.useContext();

  const cachedInput = JSON.stringify(input);
  // We're getting prefetched and dehydrated data from query (see above)
  const getCachedData = React.useCallback(
    () =>
      trpcContext.queries[key].getData(input as undefined) as
        | TRPCSubscriptionOutput<`subscriptions.${K}`>
        | undefined,
    // We don't want to pass raw input here, because it's not usually memoized outside
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trpcContext, key, cachedInput]
  );
  const [value, setValue] = React.useState<
    TRPCSubscriptionOutput<`subscriptions.${K}`> | undefined
  >(getCachedData);
  const [dataUpdatedAt, setDataUpdatedAt] = React.useState(0);
  const [errorUpdatedAt, setErrorUpdatedAt] = React.useState(0);
  const [loading, setLoading] = React.useState(() => !getCachedData());
  const [error, setError] = React.useState<TRPCError | null>(null);
  const [resubscribe, setResubscribe] = React.useState<() => void>();
  React.useEffect(() => {
    if (!enabled) {
      return;
    }
    const subscribeResult = getSubscriber(trpcContext, key, input, [
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
    subscribeResult.subscribe();
    setResubscribe(() => subscribeResult.resubscribe);
    return subscribeResult.unsubscribe;
    // We don't want to pass raw input here, because it's not usually memoized outside
    // Also, trpcContext is changed every render (TODO: create an issue in trpc repo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, cachedInput, enabled, setResubscribe]);
  const base = {
    dataUpdatedAt,
    errorUpdatedAt,
    fetchStatus: "idle" as const,
    failureReason: null,
    isInitialLoading: false,
    isPaused: false,
    refetch: resubscribe || noop,
  };
  if (loading) {
    return {
      ...base,
      data: undefined,
      error: null,
      isError: false,
      isLoading: true,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: false,
      isInitialLoading: true,
      status: "loading",
      fetchStatus: "fetching",
    };
  }
  if (error !== null) {
    if (value !== undefined) {
      return {
        ...base,
        data: value,
        error,
        isError: true,
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
      isLoading: false,
      isLoadingError: true,
      isRefetchError: false,
      isSuccess: false,
      status: "error",
    };
  }
  if (value) {
    return {
      ...base,
      data: value,
      error: null,
      isError: false,
      isLoading: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
      status: "success",
    };
  }
  throw new Error("Unexpected state!");
};

export const subscriptions = createRecursiveProxy(({ path, args }) => {
  const key = path[0] as TRPCShortSubscriptionKey;
  const input =
    args[0] as TRPCSubscriptionInput<`subscriptions.${TRPCShortSubscriptionKey}`>;
  const opts = args[1] as SubscriptionOpts;
  if (typeof window === "undefined") {
    // A hack to prefetch data from subscriptions for SSR
    // @ts-expect-error
    return trpc.queries[key].useQuery(input, opts);
  }
  return useSubscriptionClient(key, input, opts);
}) as {
  [K in TRPCShortSubscriptionKey]: {
    useSubscription: (
      ...[
        input,
        opts,
      ]: undefined extends TRPCSubscriptionInput<`subscriptions.${K}`>
        ? [
            input?: TRPCSubscriptionInput<`subscriptions.${K}`>,
            opts?: SubscriptionOpts
          ]
        : [
            input: TRPCSubscriptionInput<`subscriptions.${K}`>,
            opts?: SubscriptionOpts
          ]
    ) => UseSubscriptionResultByTopic<`subscriptions.${K}`>;
  };
};
