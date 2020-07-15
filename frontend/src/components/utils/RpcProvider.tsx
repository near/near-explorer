import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from "react";
import { ExplorerApi } from "../../libraries/explorer-wamp/index";

const initialState = {
  finalTimestamp: 0,
  lastBlockHeight: 0,
  totalBlocks: 0,
  totalTransactions: 0,
  totalAccounts: 0,
  newBlockAmount: 0,
  newTransactionAmount: 0,
  newAccountAmount: 0,
  clear: (category: string) => {},
};

const initState = {
  lastBlockHeight: 0,
  totalBlocks: 0,
  totalTransactions: 0,
  totalAccounts: 0,
  newBlockAmount: 0,
  newTransactionAmount: 0,
  newAccountAmount: 0,
};

const reducer = (currentState: any, action: any) => {
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
    case "newBlocks":
      return {
        ...currentState,
        newBlockAmount: action.blockAmount + currentState.newBlockAmount,
      };
    case "newTransactions":
      return {
        ...currentState,
        newTransactionAmount:
          action.transactionAmount + currentState.newTransactionAmount,
      };
    case "newAccounts":
      return {
        ...currentState,
        newAccountAmount: action.accountAmount + currentState.newAccountAmount,
      };
    case "clearBlock":
      return {
        ...currentState,
        newBlockAmount: 0,
      };
    case "clearTransaction":
      return {
        ...currentState,
        newTransactionAmount: 0,
      };
    case "clearAccount":
      return {
        ...currentState,
        newAccountAmount: 0,
      };
    default:
      return initState;
  }
};

const RpcContext = createContext(initialState);

export default (props: any) => {
  const [state, dispatchState] = useReducer(reducer, initState);
  const [finalTimestamp, dispatchFinalTimestamp] = useState(0);

  const fetchNewStats = function (stats: any) {
    let states = stats[0];

    let lastBlockHeight = states.lastBlockHeight;
    dispatchState({ type: "lastBlockHeight", lastBlockHeight });

    let totalBlocks = states.totalBlocks;
    dispatchState({ type: "blocks", totalBlocks });
    if (state.totalBlocks !== 0) {
      dispatchState({
        type: "newBlocks",
        blockAmount: totalBlocks - state.totalBlocks,
      });
    }

    let totalTransactions = states.totalTransactions;
    dispatchState({ type: "transactions", totalTransactions });
    if (state.totalTransactions !== 0) {
      dispatchState({
        type: "newTransactions",
        transactionAmount: totalTransactions - state.totalTransactions,
      });
    }

    let totalAccounts = states.totalAccounts;
    dispatchState({ type: "accounts", totalAccounts });
    if (state.totalAccounts !== 0) {
      dispatchState({
        type: "newAccounts",
        accountAmount: totalAccounts - state.totalAccounts,
      });
    }
  };

  const fetchFinalTimestamp = (timestamp: any) => {
    let final = timestamp[0];
    if (finalTimestamp !== final) {
      dispatchFinalTimestamp(final);
    }
  };

  const Subscription = useCallback(() => {
    new ExplorerApi().subscribe("dataStats", fetchNewStats);
    new ExplorerApi().subscribe("finalTimestamp", fetchFinalTimestamp);
  }, []);

  useEffect(() => Subscription(), [Subscription]);

  const clear = (category: string) => {
    if (category === "Block") {
      dispatchState({ type: "clearBlock" });
    } else if (category === "Transaction") {
      dispatchState({ type: "clearTransaction" });
    } else if (category === "Account") {
      dispatchState({ type: "clearAccount" });
    }
  };

  const value = {
    finalTimestamp,
    lastBlockHeight: state.lastBlockHeight,
    newBlockAmount: state.newBlockAmount,
    newTransactionAmount: state.newTransactionAmount,
    newAccountAmount: state.newAccountAmount,
    clear,
  };
  return (
    <RpcContext.Provider value={value}>{props.children}</RpcContext.Provider>
  );
};

const RpcConsumer = RpcContext.Consumer;

export { RpcConsumer };
