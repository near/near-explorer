import * as React from "react";
import * as ReactQuery from "react-query";

import { SubscriptionTopicType, SubscriptionTopicTypes } from "../types/common";
import { subscribe } from "../libraries/transport";
import { useNetworkContext } from "./use-network-context";

type UseSubscriptionResult<Topic extends SubscriptionTopicType> = Omit<
  ReactQuery.QueryObserverResult<SubscriptionTopicTypes[Topic], unknown>,
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
  | "error"
  | "errorUpdatedAt"
>;

const useSubscription = <Topic extends SubscriptionTopicType>(
  topic: Topic,
  opts?: {
    enabled?: boolean;
  }
): UseSubscriptionResult<Topic> => {
  const { networkName } = useNetworkContext();
  const enabled = opts?.enabled ?? true;
  const [value, setValue] = React.useState<
    SubscriptionTopicTypes[Topic] | undefined
  >();
  const [dataUpdatedAt, setDataUpdatedAt] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const onNextValue = React.useCallback(
    (value: SubscriptionTopicTypes[Topic]) => {
      setValue(value);
      setLoading(false);
      setDataUpdatedAt(Date.now());
    },
    [setValue, setLoading]
  );
  React.useEffect(() => {
    if (enabled) {
      return subscribe<Topic>(networkName, topic, onNextValue);
    }
  }, [networkName, topic, setValue, enabled]);
  const status = loading ? "loading" : value !== undefined ? "success" : "idle";
  return {
    status,
    isIdle: status === "idle",
    isLoading: status === "loading",
    isSuccess: status === "success",
    isError: false,
    isLoadingError: false,
    isRefetchError: false,
    data: value,
    dataUpdatedAt,
  };
};

export const useChainBlockStats = () => useSubscription("chain-blocks-stats");

export const useRecentTransactions = () =>
  useSubscription("recent-transactions");

export const useFinalityStatus = () => useSubscription("finality-status");

export const useNetworkStats = () => useSubscription("network-stats");

export const useValidators = () => useSubscription("validators");
