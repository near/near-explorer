import { createContext } from "react";

import { NearNetwork } from "../../libraries/config";

const DataContext = createContext({});

export interface Props {
  currentNearNetwork: NearNetwork;
  nearNetworks: [NearNetwork];
  children: React.ReactNode;
}

export default (props: Props) => {
  return (
    <DataContext.Provider
      value={{
        currentNearNetwork: props.currentNearNetwork,
        nearNetworks: props.nearNetworks,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

const DataConsumer = DataContext.Consumer;

export { DataConsumer, DataContext };
