import BN from "bn.js";
import React, { createContext, useEffect, useState } from "react";
import {
  ExplorerApi,
  instrumentTopicNameWithDataSource,
} from "../libraries/explorer-wamp/index";
import BlocksApi, { BlockInfo } from "../libraries/explorer-wamp/blocks";

export interface NodeStatsContext {
  validatorAmount?: number;
  seatPriceAmount?: number;
  onlineNodeAmount?: number;
  proposalAmount?: number;
  totalStakeAmount?: number;
  epochStartHeight?: number;
  epochStartBlock?: BlockInfo;
  latestBlock?: LatestBlockInfo;
  epochLength?: number;
}

export interface LatestBlockInfo {
  height?: BN;
  timestamp?: BN;
}

const NodeStatsContext = createContext<NodeStatsContext>({});

export interface Props {
  children: React.Component | React.ReactNode;
}

const NodeStatsProvider = (props: Props) => {
  const [validatorAmount, dispatchValidatorAmount] = useState<number>();
  const [onlineNodeAmount, dispatchOnlineNodeAmount] = useState<number>();
  const [proposalAmount, dispatchProposalAmount] = useState<number>();
  const [seatPriceAmount, dispatchSeatPriceAmount] = useState<number>();
  const [totalStakeAmount, dispatchTotalStakeAmount] = useState<number>();
  const [epochStartHeight, dispatchEpochStartHeight] = useState<number>();
  const [epochStartBlock, dispatchEpochStartBlock] = useState<any>();
  const [latestBlockHeight, dispatchLatestBlockHeight] = useState<BN>();
  const [finalTimestamp, dispatchFinalTimestamp] = useState<BN>();
  const [epochLength, dispatchEpochLenght] = useState<number>();

  const storeNodeInfo = (_positionalArgs: any, namedArgs: NodeStatsContext) => {
    dispatchValidatorAmount(namedArgs.validatorAmount);
    dispatchSeatPriceAmount(namedArgs.seatPriceAmount);
    dispatchOnlineNodeAmount(namedArgs.onlineNodeAmount);
    dispatchProposalAmount(namedArgs.proposalAmount);
    dispatchTotalStakeAmount(namedArgs.totalStakeAmount);
    dispatchEpochStartHeight(namedArgs.epochStartHeight);
    dispatchEpochLenght(namedArgs.epochLength);
  };

  const storeLatestBlockStats = (_positionalArgs: any, namedArgs: any) => {
    dispatchLatestBlockHeight(new BN(namedArgs.latestBlockHeight));
  };

  const storeFinalTimestamp = (
    _positionalArgs: any,
    namedArgs: {
      finalTimestamp: string;
    }
  ) => {
    dispatchFinalTimestamp(new BN(namedArgs.finalTimestamp));
  };

  useEffect(() => {
    const explorerApi = new ExplorerApi();
    explorerApi.subscribe("node-stats", storeNodeInfo);

    explorerApi.subscribe(
      instrumentTopicNameWithDataSource("chain-blocks-stats"),
      storeLatestBlockStats
    );

    explorerApi.subscribe("final-timestamp", storeFinalTimestamp);

    return () => {
      explorerApi.unsubscribe(
        instrumentTopicNameWithDataSource("chain-blocks-stats")
      );
      explorerApi.unsubscribe("node-stats");
    };
  }, []);

  useEffect(() => {
    if (epochStartHeight) {
      new BlocksApi()
        .getBlockInfo(epochStartHeight)
        .then((blockInfo: any) => {
          dispatchEpochStartBlock(blockInfo);
          return;
        })
        .catch((err: any) => console.error(err));
    }
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
        latestBlock: {
          height: latestBlockHeight,
          timestamp: finalTimestamp,
        },
        epochLength,
      }}
    >
      {props.children}
    </NodeStatsContext.Provider>
  );
};

const NodeStatsConsumer = NodeStatsContext.Consumer;

export { NodeStatsConsumer, NodeStatsContext };

export default NodeStatsProvider;
