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
      },
      blocks: [
        {
          transactionsCount: 200,
          blockHeight: 154,
          witness: "vlad.near",
          blockNumber: 60611,
          blockHash: "11111111",
          created: "2019-01-19"
        },
        {
          transactionsCount: 200,
          blockHeight: 154,
          witness: "vlad.near",
          blockNumber: 60612,
          blockHash: "22222222",
          created: "2019-01-20"
        },
        {
          transactionsCount: 200,
          blockHeight: 154,
          witness: "vlad.near",
          blockNumber: 60613,
          blockHash: "3333333",
          created: "2019-03-21"
        },
        {
          transactionsCount: 200,
          blockHeight: 154,
          witness: "vlad.near",
          blockNumber: 60614,
          blockHash: "444444444444",
          created: "2019-05-19"
        },
        {
          transactionsCount: 200,
          blockHeight: 154,
          witness: "vlad.near",
          blockNumber: 60615,
          blockHash: "5555555555555",
          created: "2019-05-29"
        },
        {
          transactionsCount: 200,
          blockHeight: 154,
          witness: "vlad.near",
          blockNumber: 60616,
          blockHash: "66666666666"
        }
      ]
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
