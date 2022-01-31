import BN from "bn.js";
import { useCallback, useMemo } from "react";
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
    useCallback(
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
  return useMemo(
    () =>
      finality?.finalBlockTimestampNanosecond
        ? new BN(finality.finalBlockTimestampNanosecond)
        : undefined,
    [finality?.finalBlockTimestampNanosecond]
  );
};

export const useLatestGasPrice = (): BN | undefined => {
  const chainBlockStats = useChainBlockStats();
  const latestGasPrice = useMemo(
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
  const latestBlockHeight = useMemo(
    () =>
      chainBlockStats?.latestBlockHeight
        ? new BN(chainBlockStats.latestBlockHeight)
        : undefined,
    [chainBlockStats?.latestBlockHeight]
  );
  return latestBlockHeight;
};
