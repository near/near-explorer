import BN from "bn.js";

import React, { createContext, useEffect, useCallback, useState } from "react";

import { DATA_SOURCE_TYPE } from "../libraries/consts";
import { ExplorerApi } from "../libraries/explorer-wamp";

const DatabaseContext = createContext({
  finalTimestamp: 0,
  latestBlockHeight: new BN(0),
  latestGasPrice: "0",
  numberOfLastMinuteBlocks: 0,
  transactionCountArray: [],
  lastDayTxCount: 0,
  last2DayTxCount: 0,
});

export default (props) => {
  const [finalTimestamp, dispatchFinalTimestamp] = useState(0);
  const [latestBlockHeight, dispatchLatestBlockHeight] = useState(0);
  const [latestGasPrice, dispatchLatestGasPrice] = useState("");
  const [numberOfLastMinuteBlocks, dispatchNumberOfLastMinuteBlocks] = useState(
    0
  );
  const [transactionCountArray, dispatchTransactionArray] = useState([]);
  const [lastDayTxCount, dispatchLastDayTxCount] = useState(0);
  const [last2DayTxCount, dispatchLast2DayTxCount] = useState(0);

  // store total amount of blocks, txs and accounts and latestBlockHeight and txs for 24hr
  const storeNewStats = function (stats) {
    // subscription data part
    let states = stats[0].blockStats;
    let {
      latestBlockHeight: newLatestBlockHeight,
      latestGasPrice: newLatestGasPrice,
      numberOfLastMinuteBlocks: newNumberOfLastMinuteBlocks,
    } = states;

    // dispatch direct data part
    dispatchLatestBlockHeight(new BN(newLatestBlockHeight));
    dispatchLatestGasPrice(newLatestGasPrice);
    dispatchNumberOfLastMinuteBlocks(newNumberOfLastMinuteBlocks);
  };

  const storeTransactionArray = function (stats) {
    let transactionCountArray = stats[0].transactionCountArray;
    dispatchLastDayTxCount(
      transactionCountArray[transactionCountArray.length - 1].total
    );
    dispatchLast2DayTxCount(
      transactionCountArray[transactionCountArray.length - 2].total
    );
    dispatchTransactionArray(transactionCountArray);
  };

  const storeFinalTimestamp = (timestamp) => {
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
      instrumentTopicNameWithDataSource("chain-block-stats"),
      storeNewStats
    );
    explorerApi.subscribe(
      instrumentTopicNameWithDataSource("chain-txs-stats"),
      storeTransactionArray
    );
    explorerApi.subscribe("final-timestamp", storeFinalTimestamp);
  }, []);

  useEffect(() => Subscription(), [Subscription]);
  return (
    <DatabaseContext.Provider
      value={{
        finalTimestamp,
        latestBlockHeight,
        latestGasPrice,
        numberOfLastMinuteBlocks,
        transactionCountArray,
        lastDayTxCount,
        last2DayTxCount,
      }}
    >
      {props.children}
    </DatabaseContext.Provider>
  );
};

const DatabaseConsumer = DatabaseContext.Consumer;

export { DatabaseConsumer, DatabaseContext };
