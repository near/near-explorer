import React, { createContext, useEffect, useCallback, useState } from "react";
import { ExplorerApi } from "../libraries/explorer-wamp/index";

const IndexerListContext = createContext({
  transactions: [],
  blocks: [],
});

export default (props) => {
  const [transactions, dispatchTransactions] = useState([]);
  const [blocks, dispatchBlocks] = useState([]);

  const fetchList = function (stats) {
    const { blocks, transactions } = stats[0];

    dispatchBlocks(blocks);
    dispatchTransactions(transactions);
  };

  const Subscription = useCallback(() => {
    new ExplorerApi().subscribe(
      "chain-latest-blocks-info:from-indexer",
      fetchList
    );
  }, []);

  useEffect(() => Subscription(), [Subscription]);

  return (
    <IndexerListContext.Provider value={{ transactions, blocks }}>
      {props.children}
    </IndexerListContext.Provider>
  );
};

const IndexerDashBoardListConsumer = IndexerListContext.Consumer;

export { IndexerDashBoardListConsumer, IndexerListContext };
