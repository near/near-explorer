import JSBI from "jsbi";
import * as React from "react";
import { trpc } from "../libraries/trpc";
import {
  useNetworkStats,
  useFinalityStatus,
  useChainBlockStats,
} from "./subscriptions";

export const useEpochStartBlock = () => {
  const { data: networkStats } = useNetworkStats();
  const blockHeight = networkStats?.epochStartHeight;
  return trpc.useQuery(["block-info", [blockHeight ?? 0]], {
    enabled: blockHeight !== undefined,
  }).data;
};

export const useFinalBlockTimestampNanosecond = (): JSBI | undefined => {
  const { data: finality } = useFinalityStatus();
  return React.useMemo(
    () =>
      finality?.finalBlockTimestampNanosecond
        ? JSBI.BigInt(finality.finalBlockTimestampNanosecond)
        : undefined,
    [finality?.finalBlockTimestampNanosecond]
  );
};

export const useLatestGasPrice = (): JSBI | undefined => {
  const { data: chainBlockStats } = useChainBlockStats();
  const latestGasPrice = React.useMemo(
    () =>
      chainBlockStats?.latestGasPrice
        ? JSBI.BigInt(chainBlockStats.latestGasPrice)
        : undefined,
    [chainBlockStats?.latestGasPrice]
  );
  return latestGasPrice;
};

export const useLatestBlockHeight = (): JSBI | undefined => {
  const { data: chainBlockStats } = useChainBlockStats();
  const latestBlockHeight = React.useMemo(
    () =>
      chainBlockStats?.latestBlockHeight
        ? JSBI.BigInt(chainBlockStats.latestBlockHeight)
        : undefined,
    [chainBlockStats?.latestBlockHeight]
  );
  return latestBlockHeight;
};
