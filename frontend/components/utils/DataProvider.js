import { useState } from "react";

const DataContext = React.createContext();

const networks = ["Testnet One"];

const DataProvider = props => {
  const [network, setNetwork] = useState(networks[0]);
  const [details, setDetails] = useState({
    onlineNodesCount: null,
    totalNodesCount: null,
    lastBlockHeight: null,
    tpsMax: null,
    lastDayTxCount: null,
    accountsCount: null
  });
  const [blocks, setBlocks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    newBlocks: 0,
    headerHidden: true,
    count: 15
  });

  // const updateNetwork = index => {
  //   setNetwork(networks[index]);
  //
  //   getBlocksInfo().then(blocks => setBlocks(blocks));
  //   getDetails().then(details => setDetails(details));
  //   getTransactionsInfo().then(transactions =>
  //     setTransactions(processTransactions(transactions))
  //   );
  // };

  return (
    <DataContext.Provider
      value={{
        networks,
        network,
        // updateNetwork,
        details,
        setDetails,
        blocks,
        setBlocks,
        transactions,
        setTransactions,
        pagination,
        setPagination
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

const DataConsumer = DataContext.Consumer;

export default DataProvider;
export { DataConsumer, DataContext };
