import React, { createContext, useEffect, useCallback, useState } from "react";

import { DATA_SOURCE_TYPE } from "../libraries/consts";
import { ExplorerApi } from "../libraries/explorer-wamp";
import TransactionApi from "../libraries/explorer-wamp/transactions";

const ListContext = createContext({
  transactions: [],
  blocks: [],
});

export default (props) => {
  const [transactions, dispatchTransactions] = useState([]);
  const [blocks, dispatchBlocks] = useState([]);

  const fetchList = function (stats) {
    const { blocks, transactions } = stats[0];

    const preprocessedBlocks = blocks.map(
      ({ hash, height, timestamp, prev_hash, transactions_count }) => ({
        hash,
        height,
        timestamp,
        prevHash: prev_hash,
        transactionsCount: transactions_count,
      })
    );

    const preprocessedTransactions = transactions.map(
      ({
        hash,
        signer_id,
        receiver_id,
        block_hash,
        block_timestamp,
        transaction_index,
        actions,
      }) => ({
        hash,
        signerId: signer_id,
        receiverId: receiver_id,
        blockHash: block_hash,
        blockTimestamp: block_timestamp,
        transactionIndex: transaction_index,
        actions: actions.map((action) => ({
          ...action,
          kind: TransactionApi.indexerCompatibilityActionKinds.get(action.kind),
        })),
      })
    );

    dispatchBlocks(preprocessedBlocks);
    dispatchTransactions(preprocessedTransactions);
  };

  const Subscription = useCallback(() => {
    const explorerApi = new ExplorerApi();

    function instrumentTopicNameWithDataSource(topicName) {
      if (explorerApi.dataSource === DATA_SOURCE_TYPE.LEGACY_SYNC_BACKEND) {
        return topicName;
      }
      return `${topicName}:${explorerApi.dataSource}`;
    }

    explorerApi.subscribe(
      instrumentTopicNameWithDataSource("chain-latest-blocks-info"),
      fetchList
    );
  }, []);

  useEffect(() => Subscription(), [Subscription]);

  return (
    <ListContext.Provider value={{ transactions, blocks }}>
      {props.children}
    </ListContext.Provider>
  );
};

const DashBoardListConsumer = ListContext.Consumer;

export { DashBoardListConsumer, ListContext };
