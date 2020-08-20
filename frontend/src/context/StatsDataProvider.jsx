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
  transactions: [],
  blocks: [],
});

export default (props) => {
  const [finalTimestamp, dispatchFinalTimestamp] = useState(0);
  const [lastBlockHeight, dispatchLastBlockHeight] = useState(0);
  const [totalBlocks, dispatchTotalBlcoks] = useState(0);
  const [totalTransactions, dispatchTotalTransactions] = useState(0);
  const [totalAccounts, dispatchTotalAccounts] = useState(0);
  const [lastDayTxCount, dispatchLastDayTxCount] = useState(0);
  const [transactions, dispatchTransactions] = useState([]);
  const [blocks, dispatchBlocks] = useState([]);

  // fetch total amount of blocks, txs and accounts and lastBlockHeight and txs for 24hr
  const fetchNewStats = function (stats) {
    // subsceiption data part
    let states = stats[0].dataStats;
    let transactions = stats[0].transactions;
    let blocks = stats[0].blocks;
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
      dispatchBlocks(blocks);
    }
    if (totalTransactions !== newTotalTransactions) {
      dispatchTotalTransactions(newTotalTransactions);
      dispatchTransactions(transactions);
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
        transactions,
        blocks,
      }}
    >
      {props.children}
    </StatsDataContext.Provider>
  );
};

const StatsDataConsumer = StatsDataContext.Consumer;

export { StatsDataConsumer, StatsDataContext };
