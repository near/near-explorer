import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from "react";
import { ExplorerApi } from "../libraries/explorer-wamp/index";

const NodeStatsContext = createContext({
  validatorAmount: 0,
  onlineNodeAmount: 0,
  proposalAmount: 0,
});

export default (props) => {
  const [validatorAmount, dispatchValidatorAmount] = useState(0);
  const [onlineNodeAmount, dispatchOnlineNodeAmount] = useState(0);
  const [proposalAmount, dispatchProposalAmount] = useState(0);

  const fetchNodeInfo = (nodes) => {
    let [newValidatorAmount, newOnlineNodeAmount, newProposalAmount] = [
      nodes[0].validatorAmount,
      nodes[0].onlineNodeAmount,
      nodes[0].proposalAmount,
    ];

    if (newValidatorAmount !== validatorAmount) {
      dispatchValidatorAmount(newValidatorAmount);
    }
    if (newOnlineNodeAmount !== onlineNodeAmount) {
      dispatchOnlineNodeAmount(newOnlineNodeAmount);
    }
    if (newProposalAmount !== proposalAmount) {
      dispatchProposalAmount(newProposalAmount);
    }
  };

  const Subscription = useCallback(() => {
    new ExplorerApi().subscribe("node-stats", fetchNodeInfo);
  }, []);

  useEffect(() => Subscription(), [Subscription]);

  return (
    <NodeStatsContext.Provider
      value={{ validatorAmount, onlineNodeAmount, proposalAmount }}
    >
      {props.children}
    </NodeStatsContext.Provider>
  );
};

const NodeStatsConsumer = NodeStatsContext.Consumer;

export { NodeStatsConsumer, NodeStatsContext };
