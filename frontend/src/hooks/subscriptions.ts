import { useWampSubscription } from "./wamp";

export const useChainBlockStats = () =>
  useWampSubscription("chain-blocks-stats");

export const useRecentTransactions = () =>
  useWampSubscription("recent-transactions");

export const useTransactionHistory = () =>
  useWampSubscription("transaction-history");

export const useFinalityStatus = () => useWampSubscription("finality-status");

export const useNetworkStats = () => useWampSubscription("network-stats");

export const useValidators = () => useWampSubscription("validators");
