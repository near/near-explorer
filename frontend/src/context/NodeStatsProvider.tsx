import React, { createContext, useEffect, useState } from "react";
import { ExplorerApi } from "../libraries/explorer-wamp/index";

export interface NodeStatsContext {
  validatorAmount?: number;
  onlineNodeAmount?: number;
  proposalAmount?: number;
}

const NodeStatsContext = createContext<NodeStatsContext>({});

export interface Props {
  children: React.Component;
}

export default (props: Props) => {
  const [validatorAmount, dispatchValidatorAmount] = useState<number>();
  const [onlineNodeAmount, dispatchOnlineNodeAmount] = useState<number>();
  const [proposalAmount, dispatchProposalAmount] = useState<number>();

  const storeNodeInfo = (_positionalArgs: any, namedArgs: NodeStatsContext) => {
    dispatchValidatorAmount(namedArgs.validatorAmount);
    dispatchOnlineNodeAmount(namedArgs.onlineNodeAmount);
    dispatchProposalAmount(namedArgs.proposalAmount);
  };

  useEffect(() => {
    const explorerApi = new ExplorerApi();
    explorerApi.subscribe("node-stats", storeNodeInfo);

    return () => {
      explorerApi.unsubscribe("node-stats");
    };
  }, []);

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
