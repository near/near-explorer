import BN from "bn.js";

import React, { createContext, useEffect, useState } from "react";

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
  transactionsCountHistory?: TransactionsCountStat[];
  recentTransactionsCount?: TransactionsCountStat[];
}

const DatabaseContext = createContext<DbContext>({});

export interface Props {
  children: React.Component;
}

const DatabaseProvider = (props: Props) => {
  const [finalityStatus, dispatchFinalityStatus] = useState<FinalityStatus>();
  const [latestBlockHeight, dispatchLatestBlockHeight] = useState<BN>();
  const [latestGasPrice, dispatchLatestGasPrice] = useState<BN>();
  const [
    recentBlockProductionSpeed,
    dispatchRecentBlockProductionSpeed,
  ] = useState<number>();
  const [transactionsCountHistory, dispatchTransactionsCountHistory] = useState<
    TransactionsCountStat[]
  >();
  const [recentTransactionsCount, dispatchRecentTransactionsCount] = useState<
    TransactionsCountStat[]
  >();

  const storeBlocksStats = function (
    _positionalArgs: any,
    namedArgs: {
      latestBlockHeight: string;
      latestGasPrice: string;
      recentBlockProductionSpeed: number;
    }
  ) {
    dispatchLatestBlockHeight(new BN(namedArgs.latestBlockHeight));
    dispatchLatestGasPrice(new BN(namedArgs.latestGasPrice));
    dispatchRecentBlockProductionSpeed(namedArgs.recentBlockProductionSpeed);
  };

  const storeTransactionsStats = function (
    _positionalArgs: any,
    namedArgs: {
      transactionsCountHistory: TransactionsCountStat[];
      recentTransactionsCount: TransactionsCountStat[];
    }
  ) {
    dispatchTransactionsCountHistory(namedArgs.transactionsCountHistory);
    dispatchRecentTransactionsCount(namedArgs.recentTransactionsCount);
  };

  const storeFinalityStatus = (_positionalArgs: any, namedArgs: any) => {
    dispatchFinalityStatus({
      finalBlockTimestampNanosecond: new BN(
        namedArgs.finalBlockTimestampNanosecond
      ),
      finalBlockHeight: namedArgs.finalBlockHeight,
    });
  };

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
        transactionsCountHistory,
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
