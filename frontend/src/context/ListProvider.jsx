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

    dispatchBlocks(blocks);
    dispatchTransactions(transactions);
  };

  const Subscription = useCallback(() => {
    new ExplorerApi()
      .subscribe("chain-latest-blocks-info", fetchList)
      .then((subscription) => subscription.unsubscribe());
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
