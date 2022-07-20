import { trpc } from "../libraries/trpc";
import { useNetworkStats } from "./subscriptions";

export const useEpochStartBlock = () => {
  const { data: networkStats } = useNetworkStats();
  const blockHeight = networkStats?.epochStartHeight;
  return trpc.useQuery(["block.byId", { height: blockHeight ?? 0 }], {
    enabled: blockHeight !== undefined,
  }).data;
};
