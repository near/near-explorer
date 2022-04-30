import * as React from "react";

import {
  SubscriptionTopicType,
  SubscriptionTopicTypes,
} from "../types/subscriptions";
import { subscribe } from "../libraries/transport";
import { useNetworkContext } from "./use-network-context";

const useSubscription = <Topic extends SubscriptionTopicType>(
  topic: Topic
): SubscriptionTopicTypes[Topic] | undefined => {
  const { currentNetwork } = useNetworkContext();
  const [value, setValue] = React.useState<
    SubscriptionTopicTypes[Topic] | undefined
  >();
  React.useEffect(() => subscribe<Topic>(currentNetwork, topic, setValue), [
    currentNetwork,
    topic,
    setValue,
  ]);
  return value;
};

export const useChainBlockStats = () => useSubscription("chain-blocks-stats");

export const useRecentTransactions = () =>
  useSubscription("recent-transactions");

export const useTransactionHistory = () =>
  useSubscription("transaction-history");

export const useFinalityStatus = () => useSubscription("finality-status");

export const useNetworkStats = () => useSubscription("network-stats");

export const useValidators = () => useSubscription("validators");
