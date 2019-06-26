import React, { Component } from "react";

import { call } from "../../api";

import * as dummyData from "./dummyData.json";

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
      transactions: dummyData.transactions
    };
  }

  static async getInitialProps(ctx) {
    const [details, blocks] = await Promise.all([
      DataProvider.getDetails(),
      DataProvider.getBlocksInfo()
    ]);
    return {
      details,
      blocks
    };
  }

  componentDidMount() {
    this.updateNetwork(0);
  }

  static async getBlocksInfo() {
    let blocks;
    try {
      blocks = await call(".select", [
        "SELECT hash, height, timestamp, list_of_approvals as listOfApprovals FROM blocks LIMIT 10"
      ]);
    } catch (error) {
      console.error(
        "DataProvider.getBlocksInfo failed to fetch data due to:",
        error
      );
      throw error;
    }
    return blocks.map((block, index) => {
      return {
        blockHash: block.hash.data,
        blockHeight: block.height,
        created: block.timestamp,
        witness: block.listOfApprovals,

        // TODO: expose this info from the backend:
        transactionsCount: 200,
        blockNumber: 60611 + index
      };
    });
  }

  static async getDetails() {
    let details;
    try {
      details = await call(".select", [
        `SELECT nodes.totalNodes, transactions.lastDayTx FROM
          (SELECT COUNT(*) as totalNodes FROM nodes) as nodes,
          (SELECT COUNT(*) as lastDayTx FROM transactions) as transactions` // TODO: fix the lastDayTx
      ]);
    } catch (error) {
      console.error(
        "DataProvider.getDetails failed to fetch data due to:",
        error
      );
      throw error;
    }
    return {
      ...details[0],

      // TODO: expose this info from the backend:
      nodesOnline: 100,
      blockHeight: 2,
      accounts: 200,
      tpsMax: "25/748"
    };
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
