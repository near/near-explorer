import * as React from "react";

import { SubscriptionTopicType, SubscriptionTopicTypes } from "../types/common";
import { subscribe } from "../libraries/transport";
import { useNetworkContext } from "./use-network-context";

const useSubscription = <Topic extends SubscriptionTopicType>(
  topic: Topic
): SubscriptionTopicTypes[Topic] | undefined => {
  const { networkName } = useNetworkContext();
  const [value, setValue] = React.useState<
    SubscriptionTopicTypes[Topic] | undefined
  >();
  React.useEffect(() => subscribe<Topic>(networkName, topic, setValue), [
    networkName,
    topic,
    setValue,
  ]);
  return value;
};

export const useChainBlockStats = () => useSubscription("chain-blocks-stats");

export const useRecentTransactions = () =>
  useSubscription("recent-transactions");

export const useFinalityStatus = () => useSubscription("finality-status");

export const useNetworkStats = () => useSubscription("network-stats");

export const useValidators = () => useSubscription("validators");
