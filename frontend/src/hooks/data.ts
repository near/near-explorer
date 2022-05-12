import BN from "bn.js";
import * as React from "react";
import { Block, getBlock } from "../providers/blocks";
import { useWampQuery } from "./wamp";
import {
  useNetworkStats,
  useFinalityStatus,
  useChainBlockStats,
} from "./subscriptions";

export const useEpochStartBlock = () => {
  const blockHashOrHeight = useNetworkStats()?.epochStartHeight;
  return useWampQuery<Block>(
    React.useCallback(
      async (wampCall) => {
        if (!blockHashOrHeight) {
          return;
        }
        return getBlock(wampCall, blockHashOrHeight);
      },
      [blockHashOrHeight]
    )
  );
};

export const useFinalBlockTimestampNanosecond = (): BN | undefined => {
  const finality = useFinalityStatus();
  return React.useMemo(
    () =>
      finality?.finalBlockTimestampNanosecond
        ? new BN(finality.finalBlockTimestampNanosecond)
        : undefined,
    [finality?.finalBlockTimestampNanosecond]
  );
};

export const useLatestGasPrice = (): BN | undefined => {
  const chainBlockStats = useChainBlockStats();
  const latestGasPrice = React.useMemo(
    () =>
      chainBlockStats?.latestGasPrice
        ? new BN(chainBlockStats.latestGasPrice)
        : undefined,
    [chainBlockStats?.latestGasPrice]
  );
  return latestGasPrice;
};

export const useLatestBlockHeight = (): BN | undefined => {
  const chainBlockStats = useChainBlockStats();
  const latestBlockHeight = React.useMemo(
    () =>
      chainBlockStats?.latestBlockHeight
        ? new BN(chainBlockStats.latestBlockHeight)
        : undefined,
    [chainBlockStats?.latestBlockHeight]
  );
  return latestBlockHeight;
};
