import React, { createContext } from "react";

const RpcContext = createContext({
  finalStamp: 0,
  lastBlockHeihgt: 0,
});

interface Props {
  finalStamp: number;
  lastBlockHeihgt: number;
  children: React.ReactNode;
}

export default (props: Props) => {
  return (
    <RpcContext.Provider
      value={{
        finalStamp: props.finalStamp,
        lastBlockHeihgt: props.lastBlockHeihgt,
      }}
    >
      {props.children}
    </RpcContext.Provider>
  );
};

const RpcConsumer = RpcContext.Consumer;

export { RpcConsumer };
