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
    let transactions = stats[0].transactions;
    let blocks = stats[0].blocks;

    dispatchBlocks(blocks);
    dispatchTransactions(transactions);
  };

  const Subscription = useCallback(() => {
    new ExplorerApi().subscribe("database-list", fetchList);
  }, []);

  useEffect(() => Subscription(), [Subscription]);
  return (
    <ListContext.Provider value={{ transactions, blocks }}>
      {props.children}
    </ListContext.Provider>
  );
};

const ListConsumer = ListContext.Consumer;

export { ListConsumer, ListContext };
