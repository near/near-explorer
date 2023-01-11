import * as nearApi from "near-api-js";
import { CodeResult } from "near-api-js/lib/providers/provider";

import { config } from "../config";
import { RPC } from "../types";

const nearRpc = new nearApi.providers.JsonRpcProvider({
  url: config.archivalRpcUrl,
  headers: config.archivalRpcApiKey
    ? { "x-api-key": config.archivalRpcApiKey }
    : undefined,
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

type CallViewMethodOptions =
  | { finality: "optimistic" | "final" }
  | { block_id: number | string };

// TODO: Provide an equivalent method in near-api-js, so we don't need to make it external.
export const callViewMethod = async function <T>(
  contractName: string,
  methodName: string,
  args: unknown,
  options: CallViewMethodOptions = { finality: "optimistic" }
): Promise<T> {
  const rawResult = await nearRpc.query<CodeResult>({
    request_type: "call_function",
    account_id: contractName,
    method_name: methodName,
    args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
    ...options,
  });
  return JSON.parse(Buffer.from(rawResult.result).toString());
};

const isErrorWithMessage = (error: unknown): error is { message: string } => {
  return Boolean(
    typeof error === "object" &&
      error &&
      "message" in error &&
      typeof (error as { message: unknown }).message === "string"
  );
};

export const ignoreIfDoesNotExist = (error: unknown): null => {
  if (
    isErrorWithMessage(error) &&
    (error.message.includes("doesn't exist") ||
      error.message.includes("does not exist") ||
      error.message.includes("MethodNotFound"))
  ) {
    return null;
  }
  throw error;
};

export * from "near-api-js";
