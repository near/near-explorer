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
  lastDayTxCount: 0,
  validatorAmount: 0,
  onlineNodeAmount: 0,
  newBlocks: 0,
  newTxs: 0,
  newAccounts: 0,
  clear: (category) => {},
});

const initialState = {
  lastBlockHeight: 0,
  totalBlocks: 0,
  totalTransactions: 0,
  totalAccounts: 0,
  lastDayTxCount: 0,
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
    case "dayTransactions":
      return {
        ...currentState,
        lastDayTxCount: action.lastDayTxCount,
      };
    default:
      return initialState;
  }
};

export default (props) => {
  const [state, dispatchState] = useReducer(reducer, initialState);
  const [finalTimestamp, dispatchFinalTimestamp] = useState(0);
  const [validatorAmount, dispatchValidatorAmount] = useState(0);
  const [onlineNodeAmount, dispatchNodeAmount] = useState(0);

  // this part is for increment for new Blocks, Txs and Accounts.
  const [currentBlock, dispatchCurrentBlock] = useState(0);
  const [newBlocks, dispatchNewBlocks] = useState(0);

  const [currentTx, dispatchCurrentTx] = useState(0);
  const [newTxs, dispatchNewTxs] = useState(0);

  const [currentAccount, dispathchCurrentAccount] = useState(0);
  const [newAccounts, dispatchNewAccounts] = useState(0);

  // update new blocks
  useEffect(() => {
    if (currentBlock === 0 && state.totalBlocks !== 0) {
      dispatchCurrentBlock(state.totalBlocks);
    }
    if (currentBlock !== 0) {
      dispatchNewBlocks(state.totalBlocks - currentBlock);
    }
  }, [state.totalBlocks, currentBlock]);

  //update new txs
  useEffect(() => {
    if (currentTx === 0 && state.totalTransactions !== 0) {
      dispatchCurrentTx(state.totalTransactions);
    }
    if (currentTx !== 0) {
      dispatchNewTxs(state.totalTransactions - currentTx);
    }
  }, [state.totalTransactions, currentTx]);

  //update new accounts
  useEffect(() => {
    if (currentAccount === 0 && state.totalAccounts !== 0) {
      dispathchCurrentAccount(state.totalAccounts);
    }
    if (currentAccount !== 0) {
      dispatchNewAccounts(state.totalAccounts - currentAccount);
    }
  }, [state.totalAccounts, currentAccount]);

  // fetch total amount of blocks, txs and accounts and lastBlockHeight and txs for 24hr
  const fetchNewStats = function (stats) {
    // subsceiption data part
    let states = stats[0];
    let lastBlockHeight = states.lastBlockHeight;
    let totalAccounts = states.totalAccounts;
    let totalBlocks = states.totalBlocks;
    let totalTransactions = states.totalTransactions;
    let lastDayTxCount = states.lastDayTxCount;

    // dispatch direct data part
    if (state.lastBlockHeight !== lastBlockHeight) {
      dispatchState({ type: "lastBlockHeight", lastBlockHeight });
    }
    if (state.totalAccounts !== totalAccounts) {
      dispatchState({ type: "accounts", totalAccounts });
    }
    if (state.totalBlocks !== totalBlocks) {
      dispatchState({ type: "blocks", totalBlocks });
    }
    if (state.totalTransactions !== totalTransactions) {
      dispatchState({ type: "transactions", totalTransactions });
    }
    if (state.lastDayTxCount !== lastDayTxCount) {
      dispatchState({ type: "dayTransactions", lastDayTxCount });
    }
  };

  const fetchFinalTimestamp = (timestamp) => {
    let final = timestamp[0];
    if (finalTimestamp !== final) {
      dispatchFinalTimestamp(final);
    }
  };

  const fetchNodeInfo = (nodes) => {
    let [validators, onlineNodes] = nodes;
    if (validatorAmount !== validators) {
      dispatchValidatorAmount(validators);
    }
    if (onlineNodeAmount !== onlineNodes) {
      dispatchNodeAmount(onlineNodes);
    }
  };

  const Subscription = useCallback(() => {
    new ExplorerApi().subscribe("dataStats", fetchNewStats);
    new ExplorerApi().subscribe("finalTimestamp", fetchFinalTimestamp);
    new ExplorerApi().subscribe("nodes", fetchNodeInfo);
  }, []);

  useEffect(() => Subscription(), [Subscription]);

  const clear = (category) => {
    if (category === "Block") {
      dispatchNewBlocks(0);
      dispatchCurrentBlock(0);
    }
    if (category === "Transaction") {
      dispatchNewTxs(0);
      dispatchCurrentTx(0);
    }
    if (category === "Account") {
      dispatchNewAccounts(0);
      dispathchCurrentAccount(0);
    }
  };

  return (
    <RpcContext.Provider
      value={{
        finalTimestamp,
        validatorAmount,
        onlineNodeAmount,
        lastBlockHeight: state.lastBlockHeight,
        totalBlocks: state.totalBlocks,
        totalTransactions: state.totalTransactions,
        totalAccounts: state.totalAccounts,
        lastDayTxCount: state.lastDayTxCount,
        newBlocks,
        newTxs,
        newAccounts,
        clear,
      }}
    >
      {props.children}
    </RpcContext.Provider>
  );
};

const RpcConsumer = RpcContext.Consumer;

export { RpcConsumer };
