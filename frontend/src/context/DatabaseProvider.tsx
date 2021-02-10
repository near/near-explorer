import BN from "bn.js";

import React, { createContext, useEffect, useState } from "react";

import { DATA_SOURCE_TYPE } from "../libraries/consts";
import { ExplorerApi } from "../libraries/explorer-wamp";

export interface TransactionsCountStat {
  date: string;
  total: number;
}

export interface DatabaseContext {
  finalTimestamp?: BN;
  latestBlockHeight?: BN;
  latestGasPrice?: BN;
  recentBlockProductionSpeed?: number;
  transactionsCountHistory?: TransactionsCountStat[];
  recentTransactionsCount?: TransactionsCountStat[];
}

const DatabaseContext = createContext<DatabaseContext>({});

export interface Props {
  children: React.Component;
}

export default (props: Props) => {
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
    _: any,
    {
      latestBlockHeight,
      latestGasPrice,
      recentBlockProductionSpeed,
    }: {
      latestBlockHeight: string;
      latestGasPrice: string;
      recentBlockProductionSpeed: number;
    }
  ) {
    dispatchLatestBlockHeight(new BN(latestBlockHeight));
    dispatchLatestGasPrice(new BN(latestGasPrice));
    dispatchRecentBlockProductionSpeed(recentBlockProductionSpeed);
  };

  const storeTransactionsStats = function (
    _: any,
    {
      transactionsCountHistory,
      recentTransactionsCount,
    }: {
      transactionsCountHistory: TransactionsCountStat[];
      recentTransactionsCount: TransactionsCountStat[];
    }
  ) {
    dispatchTransactionsCountHistory(transactionsCountHistory);
    dispatchRecentTransactionsCount(recentTransactionsCount);
  };

  const storeFinalTimestamp = ({
    finalTimestamp,
  }: {
    finalTimestamp: string;
  }) => {
    dispatchFinalTimestamp(new BN(finalTimestamp));
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
