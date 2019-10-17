import { useState } from "react";

const DataContext = React.createContext();

const networks = ["Testnet One"];

export default props => {
  const [network, setNetwork] = useState(networks[0]);

  return (
    <DataContext.Provider
      value={{
        networks,
        network
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

const DataConsumer = DataContext.Consumer;

export { DataConsumer, DataContext };
