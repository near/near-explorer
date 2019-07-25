import { useState, useEffect } from "react";

import { call } from "../../api";

const DataContext = React.createContext();

const getBlocksInfo = async () => {
  try {
    return await call(".select", [
      `SELECT blocks.hash, blocks.height, blocks.timestamp, blocks.author_id as authorId, blocks.prev_hash as prevHash, COUNT(transactions.hash) as transactionsCount FROM blocks
        LEFT JOIN chunks ON chunks.block_hash = blocks.hash
        LEFT JOIN transactions ON transactions.chunk_hash = chunks.hash
        GROUP BY blocks.hash
        ORDER BY blocks.height DESC
        LIMIT 6`
    ]);
  } catch (error) {
    console.error("DataProvider.getBlocksInfo failed to fetch data due to:");
    console.error(error);
    throw error;
  }
};

const getDetails = async () => {
  try {
    const details = await call(".select", [
      `SELECT accounts.accountsCount, nodes.totalNodesCount, online_nodes.onlineNodesCount, transactions.lastDayTxCount, last_block.lastBlockHeight FROM ` +
      `  (SELECT COUNT(*) as accountsCount FROM accounts) as accounts, ` +
      `  (SELECT COUNT(*) as totalNodesCount FROM nodes) as nodes,` +
      `  (SELECT COUNT(*) as onlineNodesCount FROM nodes WHERE last_seen > "2019-01-01") as online_nodes, ` + // TODO: Fix the date checking
      `  (SELECT COUNT(*) as lastDayTxCount FROM transactions) as transactions, ` + // TODO: fix the lastDayTx
        `  (SELECT height as lastBlockHeight FROM blocks ORDER BY height DESC LIMIT 1) as last_block`
    ]);

    return {
      ...details[0],

      // TODO: expose this info from the backend:
      tpsMax: "?/?"
    };
  } catch (error) {
    console.error("DataProvider.getDetails failed to fetch data due to:");
    console.error(error);
    throw error;
  }
};

const getTransactionsInfo = async () => {
  try {
    return await call(".select", [
      `SELECT transactions.hash, transactions.originator, transactions.kind, transactions.args, transactions.status, blocks.timestamp as blockTimestamp FROM transactions
        LEFT JOIN chunks ON chunks.hash = transactions.chunk_hash
        LEFT JOIN blocks ON blocks.hash = chunks.block_hash
        ORDER BY blocks.height DESC
        LIMIT 10`
    ]);
  } catch (error) {
    console.error(
      "DataProvider.getTransactionsInfo failed to fetch data due to:"
    );
    console.error(error);
    throw error;
  }
};

const DataProvider = props => {
  const networks = ["Testnet One", "Testnet Two"];

  const [network, setNetwork] = useState(null);
  const [details, setDetails] = useState(props.details);
  const [blocks, setBlocks] = useState(props.blocks);
  const [transactions, setTransactions] = useState(props.transactions);
  const [pagination, setPagination] = useState({
    count: 10,
    start: 1,
    stop: 10,
    total: 100 // TODO: need to get this value.
  });

  useEffect(() => {
    updateNetwork(0);
  }, []);

  const processTransactions = transactions => {
    for (let transaction of transactions) {
      let args;
      try {
        args = JSON.parse(transaction.args);
      } catch (err) {
        transaction.msg = `${transaction.kind}: ${transaction.args}`;
        continue;
      }

      switch (transaction.kind) {
        case "AddKey":
          transaction.msg = args.access_key
            ? `Access key for contract: "${args.access_key.contract_id}"`
            : `New Key Created: ${new_key}`;
          break;

        case "CreateAccount":
          transaction.msg = `New Account Created: @${
            args.new_account_id
          }, balance: ${args.amount}`;
          break;

        case "FunctionCall":
          transaction.msg = `Call: Called method in contract "${
            args.contract_id
          }"`;
          break;

        default:
          transaction.msg = `${transaction.kind}: ${JSON.stringify(
            transaction.args
          )}`;
      }
    }

    setTransactions(transactions);
  };

  const updateNetwork = index => {
    setNetwork(networks[index]);

    getBlocksInfo().then(blocks => setBlocks(blocks));
    getDetails().then(details => setDetails(details));
    getTransactionsInfo().then(transactions =>
      processTransactions(transactions)
    );
  };

  return (
    <DataContext.Provider
      value={{
        networks,
        network,
        updateNetwork,
        details,
        blocks,
        transactions,
        pagination,
        setPagination
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

DataProvider.getInitialProps = async () => {
  const [details, blocks, transactions] = await Promise.all([
    getDetails(),
    getBlocksInfo(),
    getTransactionsInfo()
  ]);

  return {
    details,
    blocks,
    transactions
  };
};

const DataConsumer = DataContext.Consumer;

export default DataProvider;
export { DataConsumer };
