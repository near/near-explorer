import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from "react";
import { ExplorerApi } from "../libraries/explorer-wamp/index";

const stateInit = {
  lastBlockHeight: 0,
  totalBlocks: 0,
  totalTransactions: 0,
  totalAccounts: 0,
  lastDayTxCount: 0,
};

const stateReducer = (currentState, action) => {
  switch (action.type) {
    case "lastBlockHeight":
      return {
        ...currentState,
        lastBlockHeight: action.lastBlockHeight,
      };
    case "blocks":
      return {
        ...currentState,
        totalBlocks: action.totalBlocks,
      };
    case "transactions":
      return {
        ...currentState,
        totalTransactions: action.totalTransactions,
      };
    case "accounts":
      return {
        ...currentState,
        totalAccounts: action.totalAccounts,
      };
    case "dayTransactions":
      return {
        ...currentState,
        lastDayTxCount: action.lastDayTxCount,
      };
    default:
      return stateInit;
  }
};

const StatsDataContext = createContext({
  finalTimestamp: 0,
  dashState: stateInit,
});

export default (props) => {
  const [dashState, dispatchState] = useReducer(stateReducer, stateInit);
  const [finalTimestamp, dispatchFinalTimestamp] = useState(0);

  // fetch total amount of blocks, txs and accounts and lastBlockHeight and txs for 24hr
  const fetchNewStats = function (stats) {
    // subsceiption data part
    let states = stats[0].dataStats;
    let [
      lastBlockHeight,
      totalAccounts,
      totalBlocks,
      totalTransactions,
      lastDayTxCount,
    ] = [
      states.lastBlockHeight,
      states.totalAccounts,
      states.totalBlocks,
      states.totalTransactions,
      states.lastDayTxCount,
    ];

    // dispatch direct data part
    if (dashState.lastBlockHeight !== lastBlockHeight) {
      dispatchState({ type: "lastBlockHeight", lastBlockHeight });
    }
    if (dashState.totalAccounts !== totalAccounts) {
      dispatchState({ type: "accounts", totalAccounts });
    }
    if (dashState.totalBlocks !== totalBlocks) {
      dispatchState({ type: "blocks", totalBlocks });
    }
    if (dashState.totalTransactions !== totalTransactions) {
      dispatchState({ type: "transactions", totalTransactions });
    }
    if (dashState.lastDayTxCount !== lastDayTxCount) {
      dispatchState({ type: "dayTransactions", lastDayTxCount });
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
        dashState,
      }}
    >
      {props.children}
    </StatsDataContext.Provider>
  );
};

const StatsDataConsumer = StatsDataContext.Consumer;

export { StatsDataConsumer, StatsDataContext };
