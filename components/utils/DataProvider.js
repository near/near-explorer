import React, { Component } from "react";

const DataContext = React.createContext();

class DataProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      networks: ["Testnet One", "Testnet Two"],
      currentNetwork: null,
      updateNetwork: this.updateNetwork
    };
  }

  componentWillMount() {
    this.setState({
      currentNetwork: this.state.networks[0]
    });
  }

  updateNetwork = index => {
    this.setState({
      currentNetwork: this.state.networks[index]
    });
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
