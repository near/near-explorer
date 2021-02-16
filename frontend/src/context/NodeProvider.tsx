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

  const fetchNodeInfo = (_positionalArgs: any, namedArgs: any) => {
    dispatchValidators(
      namedArgs.validators.map((validator: any) => ({
        accountId: validator.account_id,
        isSlashed: validator.is_slashed,
        numProducedBlocks: validator.num_produced_blocks,
        numExpectedBlocks: validator.num_expected_blocks,
        publicKey: validator.public_key,
        stake: validator.stake,
        new: validator.new,
        removed: validator.removed,
        shards: validator.shards,
        nodeInfo: validator.nodeInfo,
      }))
    );
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
