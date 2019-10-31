import { createContext } from "react";

const DataContext = createContext({});

export interface Props {
  currentNearNetwork: any;
  nearNetworks: any;
  children: React.ReactNode;
}

export default (props: Props) => {
  return (
    <DataContext.Provider
      value={{
        currentNearNetwork: props.currentNearNetwork,
        nearNetworks: props.nearNetworks
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

const DataConsumer = DataContext.Consumer;

export { DataConsumer, DataContext };
