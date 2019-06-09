import React, { Component } from "react";

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
      details: dummyData.details,
      blocks: dummyData.blocks,
      transactions: dummyData.transactions
    };
  }

  componentWillMount() {
    this.updateNetwork(0);
  }

  updateNetwork = index => {
    this.setState({
      currentNetwork: this.state.networks[index]
    });

    // To simulate network call.
    setTimeout(() => {
      this.setState({
        details: {
          nodesOnline: (index + 1) * 100,
          totalNodes: (index + 1) * 1000,
          blockHeight: (index + 1) * 2,
          accounts: (index + 1) * 200,
          tpsMax: "25/748",
          lastDayTx: "2477500"
        }
      });
    }, 500);
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
