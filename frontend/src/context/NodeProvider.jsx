import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { ExplorerApi } from "../libraries/explorer-wamp/index";
const equal = require("fast-deep-equal");

const nodeInit = {
  validators: [],
  onlineNodes: [],
  proposals: [],
  onlineValidatingNodes: [],
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
    case "onlineValidating":
      return {
        ...currentState,
        onlineValidatingNodes: action.onlineValidatingNodes,
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
    let {
      onlineNodes,
      validators,
      proposals,
      onlineValidatingNodes,
    } = nodes[0];

    if (!equal(nodeInfo.validators, validators)) {
      dispatchNode({ type: "validators", validators });
    }
    if (!equal(nodeInfo.onlineNodes, onlineNodes)) {
      dispatchNode({ type: "onlines", onlineNodes });
    }
    if (!equal(nodeInfo.proposals, proposals)) {
      dispatchNode({ type: "proposals", proposals });
    }
    if (!equal(nodeInfo.onlineValidatingNodes, onlineValidatingNodes)) {
      dispatchNode({ type: "onlineValidating", onlineValidatingNodes });
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
