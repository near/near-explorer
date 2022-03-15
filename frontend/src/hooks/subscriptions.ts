import { useWampSubscription } from "./wamp";

export const useChainBlockStats = () =>
  useWampSubscription("chain-blocks-stats");

export const useChainTransactionStats = () =>
  useWampSubscription("chain-transactions-stats");

export const useFinalityStatus = () => useWampSubscription("finality-status");

export const useNetworkStats = () => useWampSubscription("network-stats");

export const useNodes = () => useWampSubscription("nodes");
