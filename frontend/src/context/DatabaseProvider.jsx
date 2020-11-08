import React, { createContext, useEffect, useCallback, useState } from "react";
import { ExplorerApi } from "../libraries/explorer-wamp/index";

const DatabaseContext = createContext({
  finalTimestamp: 0,
  lastBlockHeight: 0,
  lastGasPrice: "0",
  lastMinuteBlocks: 0,
  transactionCountArray: [],
  lastDayTxCount: 0,
  last2DayTxCount: 0,
});

export default (props) => {
  const [finalTimestamp, dispatchFinalTimestamp] = useState(0);
  const [lastBlockHeight, dispatchLastBlockHeight] = useState(0);
  const [lastGasPrice, dispatchLastGasPrice] = useState("");
  const [lastMinuteBlocks, dispatchLastMinuteBlocks] = useState(0);
  const [transactionCountArray, dispatchTransactionArray] = useState([]);
  const [lastDayTxCount, dispatchLastDayTxCount] = useState(0);
  const [last2DayTxCount, dispatchLast2DayTxCount] = useState(0);

  // fetch total amount of blocks, txs and accounts and lastBlockHeight and txs for 24hr
  const fetchNewStats = function (stats) {
    // subscription data part
    let states = stats[0].blockStats;
    let {
      lastBlockHeight: newLastBlockHeight,
      lastGasPrice: newLastGasPrice,
      lastMinuteBlocks: newLastMinuteBlocks,
    } = states;

    // dispatch direct data part
    dispatchLastBlockHeight(newLastBlockHeight);
    dispatchLastGasPrice(newLastGasPrice);
    dispatchLastMinuteBlocks(newLastMinuteBlocks);
  };

  const fetchTransactionArray = function (stats) {
    let transactionCountArray = stats[0].transactionCountArray;
    dispatchLastDayTxCount(
      transactionCountArray[transactionCountArray.length - 1]
    );
    dispatchLast2DayTxCount(
      transactionCountArray[transactionCountArray.length - 2]
    );
    dispatchTransactionArray(transactionCountArray);
  };

  const fetchFinalTimestamp = (timestamp) => {
    let final = timestamp[0];
    if (finalTimestamp !== final) {
      dispatchFinalTimestamp(final);
    }
  };

  const Subscription = useCallback(() => {
    new ExplorerApi().subscribe("chain-block-stats", fetchNewStats);
    new ExplorerApi().subscribe("final-timestamp", fetchFinalTimestamp);
    new ExplorerApi().subscribe("chain-txs-stats", fetchTransactionArray);
  }, []);

  useEffect(() => Subscription(), [Subscription]);

  return (
    <DatabaseContext.Provider
      value={{
        finalTimestamp,
        lastBlockHeight,
        lastGasPrice,
        lastMinuteBlocks,
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
