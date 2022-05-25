import * as nearApi from "near-api-js";

import { config } from "../config";
import { RPC } from "../types";

const nearRpc = new nearApi.providers.JsonRpcProvider({
  url: config.archivalRpcUrl,
});

export const sendJsonRpc = <M extends keyof RPC.ResponseMapping>(
  method: M,
  args: object
): Promise<RPC.ResponseMapping[M]> => {
  return nearRpc.sendJsonRpc(method, args);
};

export const sendJsonRpcQuery = <
  K extends keyof RPC.RpcQueryRequestTypeMapping
>(
  requestType: K,
  args: object
): Promise<RPC.RpcQueryResponseNarrowed<K>> => {
  return nearRpc.sendJsonRpc<RPC.RpcQueryResponseNarrowed<K>>("query", {
    request_type: requestType,
    ...args,
  });
};

// TODO: Provide an equivalent method in near-api-js, so we don't need to make it external.
export const callViewMethod = async function <T>(
  contractName: string,
  methodName: string,
  args: unknown
): Promise<T> {
  const account = new nearApi.Account(
    ({
      provider: nearRpc,
    } as unknown) as nearApi.Connection,
    "near"
  );
  return await account.viewFunction(contractName, methodName, args);
};

export * from "near-api-js";
