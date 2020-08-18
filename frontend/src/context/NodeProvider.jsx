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
    let [
      newOnlineNodes,
      newValidators,
      newProposals,
      newOnlineValidatingNodes,
    ] = [
      nodes[0].onlineNodes,
      nodes[0].validators,
      nodes[0].proposals,
      nodes[0].onlineValidatingNodes,
    ];
    dispatchValidators(newValidators);
    dispatchOnlineNodes(newOnlineNodes);
    dispatchProposals(newProposals);
    dispatchNodes(newOnlineValidatingNodes);
  };

  const Subscription = useCallback(() => {
    new ExplorerApi().subscribe("nodes", fetchNodeInfo);
  }, []);

  useEffect(() => Subscription(), [Subscription]);

  return (
    <NodeContext.Provider value={{ validators, onlineNodes, proposals }}>
      {props.children}
    </NodeContext.Provider>
  );
};

const NodeConsumer = NodeContext.Consumer;

export { NodeConsumer, NodeContext };
