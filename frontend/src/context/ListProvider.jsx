import React, { createContext, useEffect, useCallback, useState } from "react";
import { ExplorerApi } from "../libraries/explorer-wamp/index";

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
        actions,
      })
    );

    dispatchBlocks(preprocessedBlocks);
    dispatchTransactions(preprocessedTransactions);
  };

  const Subscription = useCallback(() => {
    new ExplorerApi().subscribe("chain-latest-blocks-info", fetchList);
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
