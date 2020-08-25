import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from "react";
import { ExplorerApi } from "../libraries/explorer-wamp/index";
const equal = require("fast-deep-equal");

const NodeContext = createContext({
  validators: [],
  onlineNodes: [],
  proposals: [],
  onlineValidatingNodes: [],
});

export default (props) => {
  const [validators, dispatchValidators] = useState([]);
  const [onlineNodes, dispatchOnlineNodes] = useState([]);
  const [proposals, dispatchProposals] = useState([]);
  const [onlineValidatingNodes, dispatchNodes] = useState([]);

  const fetchNodeInfo = (nodes) => {
    let {
      onlineNodes: newOnlineNodes,
      validators: newValidators,
      proposals: newProposals,
      onlineValidatingNodes: newOnlineValidatingNodes,
    } = nodes[0];
    dispatchValidators(newValidators);
    dispatchOnlineNodes(newOnlineNodes);
    dispatchProposals(newProposals);
    dispatchNodes(newOnlineValidatingNodes);
  };

  const Subscription = useCallback(() => {
    new ExplorerApi()
      .subscribe("nodes", fetchNodeInfo)
      .then((subscription) => subscription.unsubscribe());
  }, []);

  useEffect(() => Subscription(), [Subscription]);

  return (
    <NodeContext.Provider
      value={{ validators, onlineNodes, proposals, onlineValidatingNodes }}
    >
      {props.children}
    </NodeContext.Provider>
  );
};

const NodeConsumer = NodeContext.Consumer;

export { NodeConsumer, NodeContext };
