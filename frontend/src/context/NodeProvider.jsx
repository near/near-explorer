import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from "react";
import { ExplorerApi } from "../libraries/explorer-wamp/index";

const NodeContext = createContext({
  validators: [],
  onlineNodes: [],
  proposals: [],
});

export default (props) => {
  const [validators, dispatchValidators] = useState([]);
  const [onlineNodes, dispatchOnlineNodes] = useState([]);
  const [proposals, dispatchProposals] = useState([]);

  const fetchNodeInfo = (nodes) => {
    let [newOnlineNodes, newValidators, newProposals] = [
      nodes[0].onlineNodes,
      nodes[0].validators,
      nodes[0].proposals,
    ];
    dispatchValidators(newValidators);
    dispatchOnlineNodes(newOnlineNodes);
    dispatchProposals(newProposals);
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
