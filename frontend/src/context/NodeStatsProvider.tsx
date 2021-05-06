import React, { createContext, useEffect, useState } from "react";
import { ExplorerApi } from "../libraries/explorer-wamp/index";
import BlocksApi, { BlockInfo } from "../libraries/explorer-wamp/blocks";

export interface NodeStatsContext {
  validatorAmount?: number;
  seatPriceAmount?: number;
  onlineNodeAmount?: number;
  proposalAmount?: number;
  totalStakeAmount?: number;
  epochStartHeight?: number;
  epochStartBlock?: BlockInfo;
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
  const [epochStartHeight, dispatchEpochStartHeight] = useState<number>();
  const [epochStartBlock, dispatchEpochStartBlock] = useState<any>();

  const storeNodeInfo = (_positionalArgs: any, namedArgs: NodeStatsContext) => {
    dispatchValidatorAmount(namedArgs.validatorAmount);
    dispatchSeatPriceAmount(namedArgs.seatPriceAmount);
    dispatchOnlineNodeAmount(namedArgs.onlineNodeAmount);
    dispatchProposalAmount(namedArgs.proposalAmount);
    dispatchTotalStakeAmount(namedArgs.totalStakeAmount);
    dispatchEpochStartHeight(namedArgs.epochStartHeight);
  };

  useEffect(() => {
    const explorerApi = new ExplorerApi();
    explorerApi.subscribe("node-stats", storeNodeInfo);

    if (epochStartHeight) {
      new BlocksApi()
        .getBlockInfo(epochStartHeight)
        .then((blockInfo: any) => {
          dispatchEpochStartBlock(blockInfo);
          return;
        })
        .catch((err: any) => console.error(err));
    }

    return () => {
      explorerApi.unsubscribe("node-stats");
    };
  }, [epochStartHeight]);

  return (
    <NodeStatsContext.Provider
      value={{
        validatorAmount,
        seatPriceAmount,
        onlineNodeAmount,
        proposalAmount,
        totalStakeAmount,
        epochStartHeight,
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
