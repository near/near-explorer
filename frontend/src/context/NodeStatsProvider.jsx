import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { ExplorerApi } from "../libraries/explorer-wamp/index";

const nodeInit = {
  validatorAmount: 0,
  onlineNodeAmount: 0,
  proposalAmount: 0,
};

const nodeReducer = (currentState, action) => {
  switch (action.type) {
    case "validators":
      return {
        ...currentState,
        validatorAmount: action.validatorAmount,
      };
    case "onlines":
      return {
        ...currentState,
        onlineNodeAmount: action.onlineNodeAmount,
      };
    case "proposals":
      return {
        ...currentState,
        proposalAmount: action.proposalAmount,
      };
    default:
      return nodeInit;
  }
};

const NodeStatsContext = createContext({
  nodeInfo: nodeInit,
});

export default (props) => {
  const [nodeInfo, dispatchNode] = useReducer(nodeReducer, nodeInit);

  // fetch total amount of blocks, txs and accounts and lastBlockHeight and txs for 24hr

  const fetchNodeInfo = (nodes) => {
    let { validatorAmount, onlineNodeAmount, proposalAmount } = nodes[0];

    if (nodeInfo.validatorAmount !== validatorAmount) {
      dispatchNode({ type: "validators", validatorAmount });
    }
    if (nodeInfo.onlineNodeAmount !== onlineNodeAmount) {
      dispatchNode({ type: "onlines", onlineNodeAmount });
    }
    if (nodeInfo.proposalAmount !== proposalAmount) {
      dispatchNode({ type: "proposals", proposalAmount });
    }
  };

  const Subscription = useCallback(() => {
    new ExplorerApi().subscribe("node-stats", fetchNodeInfo);
  }, []);

  useEffect(() => Subscription(), [Subscription]);

  return (
    <NodeStatsContext.Provider value={{ nodeInfo }}>
      {props.children}
    </NodeStatsContext.Provider>
  );
};

const NodeStatsConsumer = NodeStatsContext.Consumer;

export { NodeStatsConsumer, NodeStatsContext };
