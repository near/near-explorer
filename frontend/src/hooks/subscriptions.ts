import { useSubscription } from "./use-subscription";

export const useChainBlockStats = () => useSubscription(["chain-blocks-stats"]);

export const useRecentTransactions = () =>
  useSubscription(["recent-transactions"]);

export const useFinalityStatus = () => useSubscription(["finality-status"]);

export const useNetworkStats = () => useSubscription(["network-stats"]);

export const useValidators = () => useSubscription(["validators"]);
