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
  newBlockAmount: 0,
  newTransactionAmount: 0,
  newAccountsAmount: 0,
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
        newBlockAmount: currentState.newBlockAmount + action.blockAmount,
      };
    case "transactions":
      return {
        ...currentState,
        newTransactionAmount:
          currentState.newTransactionAmount + action.transactionAmount,
      };

    default:
      return initialState;
  }
};

const RpcContext = createContext(initialState);

export default (props: any) => {
  const [state, dispatchState] = useReducer(reducer, initialState);
  const [finalTimestamp, dispatchFinalTimestamp] = useState(0);
  const [newAccountsAmount, dispatchAccount] = useState(0);

  const fetchNewBlocks = function (blocks: any) {
    let lastBlockHeight = blocks[0].header.height;
    if (state.lastBlockHeight < lastBlockHeight) {
      dispatchState({ type: "lastBlockHeight", lastBlockHeight });
    }
    let blockAmount = blocks.length;
    dispatchState({ type: "blocks", blockAmount });
    let transactionAmount = blocks
      .map((block: any) => block.transactions.length)
      .reduce((num: number, current: number) => num + current, 0);
    dispatchState({ type: "transactions", transactionAmount });
  };

  const fetchFinalTimestamp = (timestamp: any) => {
    let final = timestamp[0];
    if (finalTimestamp !== final) {
      dispatchFinalTimestamp(final);
    }
  };

  const fetchNewAccounts = (accounts: any) => {
    if (accounts[0][0] !== undefined) {
      dispatchAccount(newAccountsAmount + accounts[0][0]);
    }
  };

  const Subscription = useCallback(() => {
    new ExplorerApi().subscribe("blocks", fetchNewBlocks);
    new ExplorerApi().subscribe("finalTimestamp", fetchFinalTimestamp);
    new ExplorerApi().subscribe("accounts", fetchNewAccounts);
  }, []);

  useEffect(() => Subscription(), [Subscription]);

  const value = {
    finalTimestamp,
    lastBlockHeight: state.lastBlockHeight,
    newBlockAmount: state.newBlockAmount,
    newTransactionAmount: state.newTransactionAmount,
    newAccountsAmount,
  };
  return (
    <RpcContext.Provider value={value}>{props.children}</RpcContext.Provider>
  );
};

const RpcConsumer = RpcContext.Consumer;

export { RpcConsumer };
