import React, { Component } from "react";

import { call } from "../../api";

const DataContext = React.createContext();

class DataProvider extends Component {
  constructor(props) {
    super(props);

    // Dummy data.
    this.state = {
      networks: ["Testnet One", "Testnet Two"],
      currentNetwork: null,
      updateNetwork: this.updateNetwork,
      details: this.props.details,
      blocks: this.props.blocks,
      transactions: this.props.transactions
    };
  }

  static async getInitialProps(ctx) {
    const [details, blocks, transactions] = await Promise.all([
      DataProvider.getDetails(),
      DataProvider.getBlocksInfo(),
      DataProvider.getTransactionsInfo()
    ]);
    return {
      details,
      blocks,
      transactions
    };
  }

  componentDidMount() {
    this.updateNetwork(0);
  }

  static async getBlocksInfo() {
    try {
      return await call(".select", [
        `SELECT blocks.hash, blocks.height, blocks.timestamp, blocks.author_id as authorId, COUNT(transactions.hash) as transactionsCount FROM blocks
          LEFT JOIN chunks ON chunks.block_hash = blocks.hash
          LEFT JOIN transactions ON transactions.chunk_hash = chunks.hash
          GROUP BY blocks.hash
          ORDER BY blocks.height DESC
          LIMIT 10`
      ]);
    } catch (error) {
      console.error(
        "DataProvider.getBlocksInfo failed to fetch data due to:",
        error
      );
      throw error;
    }
  }

  static async getDetails() {
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
        tpsMax: "25/748"
      };
    } catch (error) {
      console.error(
        "DataProvider.getDetails failed to fetch data due to:",
        error
      );
      throw error;
    }
  }

  static async getTransactionsInfo() {
    try {
      return await call(".select", [
        `SELECT transactions.hash, transactions.originator, transactions.kind, transactions.args, transactions.status, blocks.timestamp as blockTimestamp FROM transactions
          LEFT JOIN chunks ON chunks.hash = transactions.chunk_hash
          LEFT JOIN blocks ON blocks.hash = chunks.block_hash`
      ]);
    } catch (error) {
      console.error(
        "DataProvider.getTransactionsInfo failed to fetch data due to:",
        error
      );
      throw error;
    }
  }

  updateNetwork = index => {
    this.setState(({ networks }) => {
      return { currentNetwork: networks[index] };
    });

    DataProvider.getBlocksInfo().then(blocks => this.setState({ blocks }));
    DataProvider.getDetails().then(details => this.setState({ details }));
  };

  render() {
    return (
      <DataContext.Provider value={this.state}>
        {this.props.children}
      </DataContext.Provider>
    );
  }
}

const DataConsumer = DataContext.Consumer;

export default DataProvider;
export { DataConsumer };
