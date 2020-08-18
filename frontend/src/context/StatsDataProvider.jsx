import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from "react";
import { ExplorerApi } from "../libraries/explorer-wamp/index";

const StatsDataContext = createContext({
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
    // subsceiption data part
    let states = stats[0].dataStats;
    let [
      newLastBlockHeight,
      newTotalAccounts,
      newTotalBlocks,
      newTotalTransactions,
      newLastDayTxCount,
    ] = [
      states.lastBlockHeight,
      states.totalAccounts,
      states.totalBlocks,
      states.totalTransactions,
      states.lastDayTxCount,
    ];

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
    new ExplorerApi().subscribe("data-stats", fetchNewStats);
    new ExplorerApi().subscribe("final-timestamp", fetchFinalTimestamp);
  }, []);

  useEffect(() => Subscription(), [Subscription]);

  return (
    <StatsDataContext.Provider
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
    </StatsDataContext.Provider>
  );
};

const StatsDataConsumer = StatsDataContext.Consumer;

export { StatsDataConsumer, StatsDataContext };
