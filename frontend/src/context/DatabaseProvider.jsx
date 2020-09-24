import React, { createContext, useEffect, useCallback, useState } from "react";
import { ExplorerApi } from "../libraries/explorer-wamp/index";

const DatabaseContext = createContext({
  finalTimestamp: 0,
  lastBlockHeight: 0,
  totalBlocks: 0,
  totalTransactions: 0,
  totalAccounts: 0,
  lastDayTxCount: 0,
  totalStake: "",
  totalVotes: "",
});

export default (props) => {
  const [finalTimestamp, dispatchFinalTimestamp] = useState(0);
  const [lastBlockHeight, dispatchLastBlockHeight] = useState(0);
  const [totalBlocks, dispatchTotalBlcoks] = useState(0);
  const [totalTransactions, dispatchTotalTransactions] = useState(0);
  const [totalAccounts, dispatchTotalAccounts] = useState(0);
  const [lastDayTxCount, dispatchLastDayTxCount] = useState(0);
  const [totalStake, dispatchTotalStake] = useState(
    "11416584959186517242479124953463"
  );
  const [totalVotes, dispatchTotalVotes] = useState(
    "1272506343149920375853886366252"
  );

  // fetch total amount of blocks, txs and accounts and lastBlockHeight and txs for 24hr
  const fetchNewStats = function (stats) {
    // subsceiption data part
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

  const fetchVoteStats = (stats) => {
    const { totalVotes, totalStake } = stats[0];
    dispatchTotalVotes(totalVotes);
    dispatchTotalStake(totalStake);
  };

  const Subscription = useCallback(() => {
    new ExplorerApi().subscribe("chain-stats", fetchNewStats);
    new ExplorerApi().subscribe("final-timestamp", fetchFinalTimestamp);
    new ExplorerApi().subscribe("vote", fetchVoteStats);
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
        totalStake,
        totalVotes,
      }}
    >
      {props.children}
    </DatabaseContext.Provider>
  );
};

const DatabaseConsumer = DatabaseContext.Consumer;

export { DatabaseConsumer, DatabaseContext };
