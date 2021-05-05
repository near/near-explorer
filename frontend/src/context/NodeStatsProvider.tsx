import React, { createContext, useEffect, useState } from "react";
import { ExplorerApi } from "../libraries/explorer-wamp/index";
import BlocksApi from "../libraries/explorer-wamp/blocks";

export interface NodeStatsContext {
  validatorAmount?: number;
  seatPriceAmount?: number;
  onlineNodeAmount?: number;
  proposalAmount?: number;
  totalStakeAmount?: number;
  epochStartHeightAmount?: number;
  epochStartBlock?: any;
}

const NodeStatsContext = createContext<NodeStatsContext>({});

export interface Props {
  children: React.Component;
}

const NodeStatsProvider = (props: Props) => {
  const [validatorAmount, dispatchValidatorAmount] = useState<number>();
  const [onlineNodeAmount, dispatchOnlineNodeAmount] = useState<number>();
  const [proposalAmount, dispatchProposalAmount] = useState<number>();
  const [seatPriceAmount, dispatchSeatPriceAmount] = useState<number>();
  const [totalStakeAmount, dispatchTotalStakeAmount] = useState<number>();
  const [
    epochStartHeightAmount,
    dispatchEpochStartHeightAmount,
  ] = useState<number>();
  const [epochStartBlock, dispatchEpochStartBlock] = useState<any>();

  const storeNodeInfo = (_positionalArgs: any, namedArgs: NodeStatsContext) => {
    dispatchValidatorAmount(namedArgs.validatorAmount);
    dispatchSeatPriceAmount(namedArgs.seatPriceAmount);
    dispatchOnlineNodeAmount(namedArgs.onlineNodeAmount);
    dispatchProposalAmount(namedArgs.proposalAmount);
    dispatchTotalStakeAmount(namedArgs.totalStakeAmount);
    dispatchEpochStartHeightAmount(namedArgs.epochStartHeightAmount);
  };

  useEffect(() => {
    const explorerApi = new ExplorerApi();
    explorerApi.subscribe("node-stats", storeNodeInfo);

    if (epochStartHeightAmount) {
      new BlocksApi()
        .getBlockInfo(epochStartHeightAmount)
        .then((blockInfo: any) => {
          dispatchEpochStartBlock(blockInfo);
          return;
        })
        .catch((err: any) => console.error(err));
    }

    return () => {
      explorerApi.unsubscribe("node-stats");
    };
  }, [epochStartHeightAmount]);

  return (
    <NodeStatsContext.Provider
      value={{
        validatorAmount,
        seatPriceAmount,
        onlineNodeAmount,
        proposalAmount,
        totalStakeAmount,
        epochStartHeightAmount,
        epochStartBlock,
      }}
    >
      {props.children}
    </NodeStatsContext.Provider>
  );
};

const NodeStatsConsumer = NodeStatsContext.Consumer;

export { NodeStatsConsumer, NodeStatsContext };

export default NodeStatsProvider;
