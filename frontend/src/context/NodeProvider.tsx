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

export default (props: Props) => {
  const [validators, dispatchValidators] = useState<Validating[]>();
  const [onlineNodes, dispatchOnlineNodes] = useState<NodeInfo[]>();
  const [proposals, dispatchProposals] = useState<Proposal[]>();
  const [onlineValidatingNodes, dispatchNodes] = useState<NodeInfo[]>();

  const fetchNodeInfo = (
    _: any,
    { onlineNodes, validators, proposals, onlineValidatingNodes }: INodeContext
  ) => {
    dispatchValidators(validators);
    dispatchOnlineNodes(onlineNodes);
    dispatchProposals(proposals);
    dispatchNodes(onlineValidatingNodes);
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
