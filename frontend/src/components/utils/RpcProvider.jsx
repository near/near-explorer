import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from "react";
import { ExplorerApi } from "../../libraries/explorer-wamp/index";

const RpcContext = createContext({
  finalTimestamp: 0,
  lastBlockHeight: 0,
  totalBlocks: 0,
  totalTransactions: 0,
  totalAccounts: 0,
  clear: (category) => {},
});

const initialState = {
  lastBlockHeight: 0,
  totalBlocks: 0,
  totalTransactions: 0,
  totalAccounts: 0,
};

const reducer = (currentState, action) => {
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
    default:
      return initialState;
  }
};

export default (props) => {
  const [state, dispatchState] = useReducer(reducer, initialState);
  const [finalTimestamp, dispatchFinalTimestamp] = useState(0);

  const fetchNewStats = function (stats) {
    // subsceiption data part
    let states = stats[0];
    let lastBlockHeight = states.lastBlockHeight;
    let totalAccounts = states.totalAccounts;
    let totalBlocks = states.totalBlocks;
    let totalTransactions = states.totalTransactions;

    // dispatch direct data part
    dispatchState({ type: "lastBlockHeight", lastBlockHeight });
    dispatchState({ type: "blocks", totalBlocks });
    dispatchState({ type: "transactions", totalTransactions });
    dispatchState({ type: "accounts", totalAccounts });
  };

  console.log(state);

  const fetchFinalTimestamp = (timestamp) => {
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

  const clear = (category) => {
    if (category === "Block") {
      dispatchState({ type: "clearBlock" });
    } else if (category === "Transaction") {
      dispatchState({ type: "clearTransaction" });
    } else if (category === "Account") {
      dispatchState({ type: "clearAccount" });
    }
  };

  return (
    <RpcContext.Provider
      value={{
        finalTimestamp,
        lastBlockHeight: state.lastBlockHeight,
        totalBlocks: state.totalBlocks,
        totalTransactions: state.totalTransactions,
        totalAccounts: state.totalAccounts,
        clear,
      }}
    >
      {props.children}
    </RpcContext.Provider>
  );
};

const RpcConsumer = RpcContext.Consumer;

export { RpcConsumer };
