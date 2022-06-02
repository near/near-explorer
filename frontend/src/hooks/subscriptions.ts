import { useSubscription } from "./use-subscription";

export const useNetworkStats = () => useSubscription(["network-stats"]);
