import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from "react";
import { ExplorerApi } from "../../libraries/explorer-wamp/index";

const nodeInit = {
  validatorAmount: 0,
  onlineNodeAmount: 0,
  proposalAmount: 0,
  validators: [],
  onlineNodes: [],
  proposals: [],
};

const nodeReducer = (currentState, action) => {
  switch (action.type) {
    case "validators":
      return {
        ...currentState,
        validatorAmount: action.validatorAmount,
        validators: action.validators,
      };
    case "onlines":
      return {
        ...currentState,
        onlineNodeAmount: action.onlineNodeAmount,
        onlineNodes: action.onlineNodes,
      };
    case "proposals":
      return {
        ...currentState,
        proposalAmount: action.proposalAmount,
        proposals: action.proposals,
      };
    default:
      return nodeInit;
  }
};

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

const SubContext = createContext({
  finalTimestamp: 0,
  dashState: stateInit,
  nodeInfo: nodeInit,
});

export default (props) => {
  const [dashState, dispatchState] = useReducer(stateReducer, stateInit);
  const [nodeInfo, dispatchNode] = useReducer(nodeReducer, nodeInit);
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

  const fetchNodeInfo = (nodes) => {
    let { validatingNodes, onlineNodes } = nodes[0];

    let validators = validatingNodes.current_validators;
    let validatorAmount = validators.length;

    let proposals = validatingNodes.current_proposals;
    let proposalAmount = proposals.length;

    let onlineNodeAmount = onlineNodes.length;

    if (nodeInfo.validatorAmount !== validatorAmount) {
      dispatchNode({ type: "validators", validatorAmount, validators });
    }
    if (nodeInfo.onlineNodeAmount !== onlineNodeAmount) {
      dispatchNode({ type: "onlines", onlineNodeAmount, onlineNodes });
    }
    if (nodeInfo.proposalAmount !== proposalAmount) {
      dispatchNode({ type: "proposals", proposalAmount, proposals });
    }
  };

  const Subscription = useCallback(() => {
    new ExplorerApi().subscribe("data-stats", fetchNewStats);
    new ExplorerApi().subscribe("final-timestamp", fetchFinalTimestamp);
    new ExplorerApi().subscribe("nodes", fetchNodeInfo);
  }, []);

  useEffect(() => Subscription(), [Subscription]);

  return (
    <SubContext.Provider
      value={{
        finalTimestamp,
        dashState,
        nodeInfo,
      }}
    >
      {props.children}
    </SubContext.Provider>
  );
};

const SubConsumer = SubContext.Consumer;

export { SubConsumer };
