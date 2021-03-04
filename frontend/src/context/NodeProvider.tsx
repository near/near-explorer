import React, { createContext, useEffect, useState } from "react";

import { ExplorerApi } from "../libraries/explorer-wamp";
import {
  NodeInfo,
  Proposal,
  Validating,
} from "../libraries/explorer-wamp/nodes";

export interface INodeContext {
  validators?: Validating[];
  onlineNodes?: NodeInfo[];
  proposals?: Proposal[];
  onlineValidatingNodes?: NodeInfo[];
}

const NodeContext = createContext<INodeContext>({});

export interface Props {
  children: React.Component;
}

const NodeProvider = (props: Props) => {
  const [validators, dispatchValidators] = useState<Validating[]>();
  const [onlineNodes, dispatchOnlineNodes] = useState<NodeInfo[]>();
  const [proposals, dispatchProposals] = useState<Proposal[]>();
  const [onlineValidatingNodes, dispatchNodes] = useState<NodeInfo[]>();

  const fetchNodeInfo = (_positionalArgs: any, namedArgs: INodeContext) => {
    dispatchValidators(namedArgs.validators);
    dispatchOnlineNodes(namedArgs.onlineNodes);
    dispatchProposals(namedArgs.proposals);
    dispatchNodes(namedArgs.onlineValidatingNodes);
  };

  useEffect(() => {
    const explorerApi = new ExplorerApi();
    explorerApi.subscribe("nodes", fetchNodeInfo);

    return () => {
      explorerApi.unsubscribe("nodes");
    };
  }, []);

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

export default NodeProvider;
