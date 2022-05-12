import JSBI from "jsbi";
import * as React from "react";
import { useQuery } from "./use-query";
import {
  useNetworkStats,
  useFinalityStatus,
  useChainBlockStats,
} from "./subscriptions";

export const useEpochStartBlock = () => {
  const blockHashOrHeight = useNetworkStats()?.epochStartHeight;
  return useQuery("block-info", [blockHashOrHeight ?? 0], {
    enabled: blockHashOrHeight !== undefined,
  }).data;
};

export const useFinalBlockTimestampNanosecond = (): JSBI | undefined => {
  const finality = useFinalityStatus();
  return React.useMemo(
    () =>
      finality?.finalBlockTimestampNanosecond
        ? JSBI.BigInt(finality.finalBlockTimestampNanosecond)
        : undefined,
    [finality?.finalBlockTimestampNanosecond]
  );
};

export const useLatestGasPrice = (): JSBI | undefined => {
  const chainBlockStats = useChainBlockStats();
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
  const chainBlockStats = useChainBlockStats();
  const latestBlockHeight = React.useMemo(
    () =>
      chainBlockStats?.latestBlockHeight
        ? JSBI.BigInt(chainBlockStats.latestBlockHeight)
        : undefined,
    [chainBlockStats?.latestBlockHeight]
  );
  return latestBlockHeight;
};
