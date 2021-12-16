import BN from "bn.js";

import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  FC,
} from "react";

import {
  ExplorerApi,
  instrumentTopicNameWithDataSource,
} from "../libraries/explorer-wamp";

import { FinalityStatus } from "./NetworkStatsProvider";

export interface TransactionsCountStat {
  date: string;
  total: number;
}

export interface DbContext {
  finalityStatus?: FinalityStatus;
  latestBlockHeight?: BN;
  latestGasPrice?: BN;
  recentBlockProductionSpeed?: number;
  transactionsCountHistoryForTwoWeeks?: TransactionsCountStat[];
  recentTransactionsCount?: number;
}

const DatabaseContext = createContext<DbContext>({});

const DatabaseProvider: FC = (props) => {
  const [finalityStatus, dispatchFinalityStatus] = useState<FinalityStatus>();
  const [latestBlockHeight, dispatchLatestBlockHeight] = useState<BN>();
  const [latestGasPrice, dispatchLatestGasPrice] = useState<BN>();
  const [
    recentBlockProductionSpeed,
    dispatchRecentBlockProductionSpeed,
  ] = useState<number>();
  const [
    transactionsCountHistoryForTwoWeeks,
    dispatchTransactionsCountHistory,
  ] = useState<TransactionsCountStat[]>();
  const [
    recentTransactionsCount,
    dispatchRecentTransactionsCount,
  ] = useState<number>();

  const storeBlocksStats = useCallback(
    (
      _positionalArgs: any,
      namedArgs: {
        latestBlockHeight: string;
        latestGasPrice: string;
        recentBlockProductionSpeed: number;
      }
    ) => {
      const latestBlockHeight = new BN(namedArgs.latestBlockHeight);
      dispatchLatestBlockHeight((prevLatestBlockHeight) => {
        if (
          prevLatestBlockHeight &&
          latestBlockHeight.eq(prevLatestBlockHeight)
        ) {
          return prevLatestBlockHeight;
        }
        return latestBlockHeight;
      });

      const latestGasPrice = new BN(namedArgs.latestGasPrice);
      dispatchLatestGasPrice((prevLatestGasPrice) => {
        if (prevLatestGasPrice && latestGasPrice.eq(prevLatestGasPrice)) {
          return prevLatestGasPrice;
        }
        return latestGasPrice;
      });

      dispatchRecentBlockProductionSpeed(namedArgs.recentBlockProductionSpeed);
    },
    []
  );

  const storeTransactionsStats = useCallback(
    (
      _positionalArgs: any,
      namedArgs: {
        transactionsCountHistoryForTwoWeeks: TransactionsCountStat[];
        recentTransactionsCount: number;
      }
    ) => {
      dispatchTransactionsCountHistory(
        namedArgs.transactionsCountHistoryForTwoWeeks
      );
      dispatchRecentTransactionsCount(namedArgs.recentTransactionsCount);
    },
    []
  );

  const storeFinalityStatus = useCallback(
    (_positionalArgs: any, namedArgs: any) => {
      dispatchFinalityStatus({
        finalBlockTimestampNanosecond: new BN(
          namedArgs.finalBlockTimestampNanosecond
        ),
        finalBlockHeight: namedArgs.finalBlockHeight,
      });
    },
    []
  );

  useEffect(() => {
    const explorerApi = new ExplorerApi();

    explorerApi.subscribe(
      instrumentTopicNameWithDataSource("chain-blocks-stats"),
      storeBlocksStats
    );
    explorerApi.subscribe(
      instrumentTopicNameWithDataSource("chain-transactions-stats"),
      storeTransactionsStats
    );
    explorerApi.subscribe("finality-status", storeFinalityStatus);

    return () => {
      explorerApi.unsubscribe(
        instrumentTopicNameWithDataSource("chain-blocks-stats")
      );
      explorerApi.unsubscribe(
        instrumentTopicNameWithDataSource("chain-transactions-stats")
      );
      explorerApi.unsubscribe("finality-status");
    };
  }, []);

  return (
    <DatabaseContext.Provider
      value={{
        finalityStatus,
        latestBlockHeight,
        latestGasPrice,
        recentBlockProductionSpeed,
        transactionsCountHistoryForTwoWeeks,
        recentTransactionsCount,
      }}
    >
      {props.children}
    </DatabaseContext.Provider>
  );
};

const DatabaseConsumer = DatabaseContext.Consumer;

export { DatabaseConsumer, DatabaseContext };

export default DatabaseProvider;
