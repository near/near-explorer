import React, { createContext, useEffect, useState } from "react";

import { ExplorerApi } from "../libraries/explorer-wamp";
import { NodeInfo, ValidationNodeInfo } from "../libraries/explorer-wamp/nodes";

export interface INodeContext {
  currentValidators?: ValidationNodeInfo[];
  onlineNodes?: NodeInfo[];
  currentProposals?: ValidationNodeInfo[];
  onlineValidatingNodes?: NodeInfo[];
}

const NodeContext = createContext<INodeContext>({});

export interface Props {
  children: React.Component;
}

const NodeProvider = (props: Props) => {
  const [currentValidators, dispatchValidators] = useState<
    ValidationNodeInfo[]
  >();
  const [currentProposals, dispatchCurrentProposals] = useState<
    ValidationNodeInfo[]
  >();
  const [onlineNodes, dispatchOnlineNodes] = useState<NodeInfo[]>();
  const [onlineValidatingNodes, dispatchNodes] = useState<NodeInfo[]>();

  const fetchNodeInfo = (_positionalArgs: any, namedArgs: INodeContext) => {
    dispatchValidators(namedArgs.currentValidators);
    dispatchCurrentProposals(namedArgs.currentProposals);
    dispatchOnlineNodes(namedArgs.onlineNodes);
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
      value={{
        currentValidators,
        currentProposals,
        onlineNodes,
        onlineValidatingNodes,
      }}
    >
      {props.children}
    </NodeContext.Provider>
  );
};

const NodeConsumer = NodeContext.Consumer;

export { NodeConsumer, NodeContext };

export default NodeProvider;
