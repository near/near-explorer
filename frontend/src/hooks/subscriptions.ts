import { useSubscription } from "./use-subscription";

export const useNetworkStats = () => useSubscription(["network-stats"]);

export const useValidators = () => useSubscription(["validators"]);
