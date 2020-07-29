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

const NodeContext = createContext({
  nodeInfo: nodeInit,
});

export default (props) => {
  const [nodeInfo, dispatchNode] = useReducer(nodeReducer, nodeInit);

  // fetch total amount of blocks, txs and accounts and lastBlockHeight and txs for 24hr

  const fetchNodeInfo = (nodes) => {
    let { onlineNodes, validators, proposals } = nodes[0];

    let validatorAmount = validators.length;
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
    new ExplorerApi().subscribe("nodes", fetchNodeInfo);
  }, []);

  useEffect(() => Subscription(), [Subscription]);

  return (
    <NodeContext.Provider value={{ nodeInfo }}>
      {props.children}
    </NodeContext.Provider>
  );
};

const NodeConsumer = NodeContext.Consumer;

export { NodeConsumer, NodeContext };
