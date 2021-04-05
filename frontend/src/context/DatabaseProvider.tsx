import BN from "bn.js";

import React, { createContext, useEffect, useState } from "react";

import { DATA_SOURCE_TYPE } from "../libraries/consts";
import { ExplorerApi } from "../libraries/explorer-wamp";

export interface TransactionsCountStat {
  date: string;
  total: number;
}

export interface DbContext {
  finalTimestamp?: BN;
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
  const [finalTimestamp, dispatchFinalTimestamp] = useState<BN>();
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

  const storeFinalTimestamp = (
    _positionalArgs: any,
    namedArgs: {
      finalTimestamp: string;
    }
  ) => {
    dispatchFinalTimestamp(new BN(namedArgs.finalTimestamp));
  };

  useEffect(() => {
    const explorerApi = new ExplorerApi();

    function instrumentTopicNameWithDataSource(topicName: string) {
      if (explorerApi.dataSource === DATA_SOURCE_TYPE.LEGACY_SYNC_BACKEND) {
        return topicName;
      }
      return `${topicName}:${explorerApi.dataSource}`;
    }

    explorerApi.subscribe(
      instrumentTopicNameWithDataSource("chain-blocks-stats"),
      storeBlocksStats
    );
    explorerApi.subscribe(
      instrumentTopicNameWithDataSource("chain-transactions-stats"),
      storeTransactionsStats
    );
    explorerApi.subscribe("final-timestamp", storeFinalTimestamp);

    return () => {
      explorerApi.unsubscribe(
        instrumentTopicNameWithDataSource("chain-blocks-stats")
      );
      explorerApi.unsubscribe(
        instrumentTopicNameWithDataSource("chain-transactions-stats")
      );
      explorerApi.unsubscribe(
        instrumentTopicNameWithDataSource("final-timestamp")
      );
    };
  }, []);

  return (
    <DatabaseContext.Provider
      value={{
        finalTimestamp,
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
