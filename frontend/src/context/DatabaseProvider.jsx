import React, { createContext, useEffect, useCallback, useState } from "react";

import { DATA_SOURCE_TYPE } from "../libraries/consts";
import { ExplorerApi } from "../libraries/explorer-wamp";

const DatabaseContext = createContext({
  finalTimestamp: 0,
  lastBlockHeight: 0,
  totalBlocks: 0,
  totalTransactions: 0,
  totalAccounts: 0,
  lastDayTxCount: 0,
});

export default (props) => {
  const [finalTimestamp, dispatchFinalTimestamp] = useState(0);
  const [lastBlockHeight, dispatchLastBlockHeight] = useState(0);
  const [totalBlocks, dispatchTotalBlcoks] = useState(0);
  const [totalTransactions, dispatchTotalTransactions] = useState(0);
  const [totalAccounts, dispatchTotalAccounts] = useState(0);
  const [lastDayTxCount, dispatchLastDayTxCount] = useState(0);

  // fetch total amount of blocks, txs and accounts and lastBlockHeight and txs for 24hr
  const fetchNewStats = function (stats) {
    // subscription data part
    let states = stats[0].dataStats;
    let {
      lastBlockHeight: newLastBlockHeight,
      totalAccounts: newTotalAccounts,
      totalBlocks: newTotalBlocks,
      totalTransactions: newTotalTransactions,
      lastDayTxCount: newLastDayTxCount,
    } = states;

    // dispatch direct data part
    if (lastBlockHeight !== newLastBlockHeight) {
      dispatchLastBlockHeight(newLastBlockHeight);
    }
    if (totalAccounts !== newTotalAccounts) {
      dispatchTotalAccounts(newTotalAccounts);
    }
    if (totalBlocks !== newTotalBlocks) {
      dispatchTotalBlcoks(newTotalBlocks);
    }
    if (totalTransactions !== newTotalTransactions) {
      dispatchTotalTransactions(newTotalTransactions);
    }
    if (lastDayTxCount !== newLastDayTxCount) {
      dispatchLastDayTxCount(newLastDayTxCount);
    }
  };

  const fetchFinalTimestamp = (timestamp) => {
    let final = timestamp[0];
    if (finalTimestamp !== final) {
      dispatchFinalTimestamp(final);
    }
  };

  const Subscription = useCallback(() => {
    const explorerApi = new ExplorerApi();

    function instrumentTopicNameWithDataSource(topicName) {
      if (explorerApi.dataSource === DATA_SOURCE_TYPE.LEGACY_SYNC_BACKEND) {
        return topicName;
      }
      return `${topicName}:${explorerApi.dataSource}`;
    }

    explorerApi.subscribe(
      instrumentTopicNameWithDataSource("chain-stats"),
      fetchNewStats
    );
    explorerApi.subscribe("final-timestamp", fetchFinalTimestamp);
  }, []);

  useEffect(() => Subscription(), [Subscription]);

  return (
    <DatabaseContext.Provider
      value={{
        finalTimestamp,
        lastBlockHeight,
        totalBlocks,
        totalTransactions,
        totalAccounts,
        lastDayTxCount,
      }}
    >
      {props.children}
    </DatabaseContext.Provider>
  );
};

const DatabaseConsumer = DatabaseContext.Consumer;

export { DatabaseConsumer, DatabaseContext };
