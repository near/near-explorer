import { createContext } from "react";

import { NearNetwork } from "../libraries/config";

const NetworkContext = createContext<{
  currentNearNetwork?: NearNetwork;
  nearNetworks?: [NearNetwork];
}>({});

export interface CurrentNetworkProps {
  currentNearNetwork: NearNetwork;
}

export interface Props extends CurrentNetworkProps {
  nearNetworks: [NearNetwork];
  children: React.ReactNode;
}

const NetworkProvider = (props: Props) => {
  return (
    <NetworkContext.Provider
      value={{
        currentNearNetwork: props.currentNearNetwork,
        nearNetworks: props.nearNetworks,
      }}
    >
      {props.children}
    </NetworkContext.Provider>
  );
};

const NetworkConsumer = NetworkContext.Consumer;

export { NetworkConsumer, NetworkContext };

export default NetworkProvider;
