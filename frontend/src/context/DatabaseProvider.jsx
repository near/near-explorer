import React, { createContext, useEffect, useCallback, useState } from "react";
import { ExplorerApi } from "../libraries/explorer-wamp/index";

const DatabaseContext = createContext({
  finalTimestamp: 0,
  latestBlockHeight: 0,
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

  // fetch total amount of blocks, txs and accounts and latestBlockHeight and txs for 24hr
  const fetchNewStats = function (stats) {
    // subscription data part
    let states = stats[0].blockStats;
    console.log(states);
    let {
      latestBlockHeight: newLatestBlockHeight,
      latestGasPrice: newLatestGasPrice,
      numberOfLastMinuteBlocks: newNumberOfLastMinuteBlocks,
    } = states;

    // dispatch direct data part
    dispatchLatestBlockHeight(newLatestBlockHeight);
    dispatchLatestGasPrice(newLatestGasPrice);
    dispatchNumberOfLastMinuteBlocks(newNumberOfLastMinuteBlocks);
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
