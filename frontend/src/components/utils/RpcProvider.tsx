import React, { createContext } from "react";

const RpcContext = createContext({
  finalStamp: 0,
  lastBlockHeight: 0,
});

interface Props {
  finalStamp: number;
  lastBlockHeight: number;
  children: React.ReactNode;
}

export default (props: Props) => {
  return (
    <RpcContext.Provider
      value={{
        finalStamp: props.finalStamp,
        lastBlockHeight: props.lastBlockHeight,
      }}
    >
      {props.children}
    </RpcContext.Provider>
  );
};

const RpcConsumer = RpcContext.Consumer;

export { RpcConsumer };
