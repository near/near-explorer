import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { ExplorerApi } from "../libraries/explorer-wamp/index";

const nodeInit = {
  validators: [],
  onlineNodes: [],
  proposals: [],
};

const nodeReducer = (currentState, action) => {
  switch (action.type) {
    case "validators":
      return {
        ...currentState,
        validators: action.validators,
      };
    case "onlines":
      return {
        ...currentState,
        onlineNodes: action.onlineNodes,
      };
    case "proposals":
      return {
        ...currentState,
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

    if (nodeInfo.validators.length !== validators.length) {
      dispatchNode({ type: "validators", validators });
    }
    if (nodeInfo.onlineNodes.length !== onlineNodes.length) {
      dispatchNode({ type: "onlines", onlineNodes });
    }
    if (nodeInfo.proposals.length !== proposals.length) {
      dispatchNode({ type: "proposals", proposals });
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
