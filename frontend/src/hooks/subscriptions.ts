import { useSubscription } from "@explorer/frontend/hooks/use-subscription";

export const useNetworkStats = () => useSubscription(["network-stats"]);
