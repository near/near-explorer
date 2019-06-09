import React, { Component } from "react";

const DataContext = React.createContext();

class DataProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      networks: ["Testnet One", "Testnet Two"],
      currentNetwork: null,
      updateNetwork: this.updateNetwork,
      details: {
        nodesOnline: 0,
        totalNodes: 1000,
        blockHeight: 6083793,
        tpsMax: "25/748",
        lastDayTx: "2477500",
        accounts: 2113478
      }
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
    }, 2000);
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
