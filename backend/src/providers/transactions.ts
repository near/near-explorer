import { RPC, TransactionOutcome } from "../types";
import {
  queryIndexedTransaction,
  queryTransactionsList,
  queryTransactionsActionsList,
  queryAccountTransactionsList,
  queryTransactionsListInBlock,
  queryTransactionInfo,
} from "../database/queries";
import { z } from "zod";
import { validators } from "../router/validators";

import * as nearApi from "../utils/near";

const INDEXER_COMPATIBILITY_TRANSACTION_ACTION_KINDS = new Map<
  string,
  Action["kind"]
>([
  ["ADD_KEY", "AddKey"],
  ["CREATE_ACCOUNT", "CreateAccount"],
  ["DELETE_ACCOUNT", "DeleteAccount"],
  ["DELETE_KEY", "DeleteKey"],
  ["DEPLOY_CONTRACT", "DeployContract"],
  ["FUNCTION_CALL", "FunctionCall"],
  ["STAKE", "Stake"],
  ["TRANSFER", "Transfer"],
]);

export type TransactionBaseInfo = {
  hash: string;
  signerId: string;
  receiverId: string;
  blockHash: string;
  blockTimestamp: number;
  transactionIndex: number;
  actions: Action[];
};

// helper function to init transactions list
// as we use the same structure but different queries for account, block, txInfo and list
async function createTransactionsList(
  transactionsArray: Awaited<ReturnType<typeof queryTransactionsList>>
): Promise<TransactionBaseInfo[]> {
  const transactionsHashes = transactionsArray.map(({ hash }) => hash);
  const transactionsActionsList = await getTransactionsActionsList(
    transactionsHashes
  );

  return transactionsArray.map((transaction) => ({
    hash: transaction.hash,
    signerId: transaction.signer_id,
    receiverId: transaction.receiver_id,
    blockHash: transaction.block_hash,
    blockTimestamp: parseInt(transaction.block_timestamp_ms),
    transactionIndex: transaction.transaction_index,
    actions: transactionsActionsList.get(transaction.hash) || [],
  }));
}

export const getIndexerCompatibilityTransactionActionKinds = () => {
  return INDEXER_COMPATIBILITY_TRANSACTION_ACTION_KINDS;
};

export const getIsTransactionIndexed = async (
  transactionHash: string
): Promise<boolean> => {
  const transaction = await queryIndexedTransaction(transactionHash);
  return Boolean(transaction?.transaction_hash);
};

export const getTransactionsList = async (
  limit: number | undefined,
  cursor?: z.infer<typeof validators.transactionPagination>
): Promise<TransactionBaseInfo[]> => {
  const transactionsList = await queryTransactionsList(limit, cursor);
  if (transactionsList.length === 0) {
    // we should return an empty array instead of undefined
    // to allow our ListHandler to work properly
    return [];
  }
  return await createTransactionsList(transactionsList);
};

export const getAccountTransactionsList = async (
  accountId: string,
  limit: number | undefined,
  cursor?: z.infer<typeof validators.transactionPagination>
): Promise<TransactionBaseInfo[]> => {
  const accountTxList = await queryAccountTransactionsList(
    accountId,
    limit,
    cursor
  );
  if (accountTxList.length === 0) {
    // we should return an empty array instead of undefined
    // to allow our ListHandler to work properly
    return [];
  }
  return await createTransactionsList(accountTxList);
};

export const getTransactionsListInBlock = async (
  blockHash: string,
  limit: number | undefined,
  cursor?: z.infer<typeof validators.transactionPagination>
): Promise<TransactionBaseInfo[]> => {
  const txListInBlock = await queryTransactionsListInBlock(
    blockHash,
    limit,
    cursor
  );
  if (txListInBlock.length === 0) {
    // we should return an empty array instead of undefined
    // to allow our ListHandler to work properly
    return [];
  }
  return await createTransactionsList(txListInBlock);
};

export const getTransactionInfo = async (
  transactionHash: string
): Promise<TransactionBaseInfo | null> => {
  const transactionInfo = await queryTransactionInfo(transactionHash);
  if (!transactionInfo) {
    return null;
  }
  const transaction = await createTransactionsList([transactionInfo]);
  return transaction[0] || null;
};

export const getTransactionDetails = async (
  transactionHash: string
): Promise<TransactionDetails | null> => {
  const transactionBaseInfo = await getTransactionInfo(transactionHash);

  if (!transactionBaseInfo) {
    return null;
  }
  const transactionInfo = await nearApi.sendJsonRpc("EXPERIMENTAL_tx_status", [
    transactionBaseInfo.hash,
    transactionBaseInfo.signerId,
  ]);

  const transactionFee = getTransactionFee(
    transactionInfo.transaction_outcome,
    transactionInfo.receipts_outcome
  );

  const txActions =
    transactionInfo.transaction.actions.map(mapRpcActionToAction);
  const transactionAmount = getDeposit(txActions);

  return {
    hash: transactionHash,
    timestamp: transactionBaseInfo.blockTimestamp,
    signerId: transactionInfo.transaction.signer_id,
    receiverId: transactionInfo.transaction.receiver_id,
    fee: transactionFee.toString(),
    amount: transactionAmount.toString(),
    status: convertRpcTxStatusToStatus(transactionInfo.status),
  };
};

const convertRpcTxStatusToStatus = (
  status: RPC.FinalExecutionStatus
): TransactionStatus => {
  const txStatus = Object.keys(status)[0];
  switch (txStatus) {
    case "Failure":
      return "fail";
    case "SuccessValue":
      return "success";
    default:
      return "fetching";
  }
};

export const convertDbArgsToRpcArgs = (
  kind: string,
  jsonArgs: Record<string, unknown>
): Action["args"] => {
  switch (kind) {
    case "FUNCTION_CALL":
      return {
        ...jsonArgs,
        args_base64: undefined,
        args_json: undefined,
        args: jsonArgs.args_base64,
      };
    case "ADD_KEY": {
      const dbArgs = jsonArgs as any;
      if (dbArgs.access_key.permission.permission_kind === "FULL_ACCESS") {
        return {
          ...dbArgs,
          access_key: {
            ...dbArgs.access_key,
            permission: "FullAccess",
          },
        };
      } else {
        return {
          ...dbArgs,
          access_key: {
            ...dbArgs.access_key,
            permission: {
              FunctionCall: dbArgs.access_key.permission.permission_details,
            },
          },
        };
      }
    }
    case "DEPLOY_CONTRACT":
      return {
        code: jsonArgs.code_sha256,
      };
    default:
      return jsonArgs;
  }
};

async function getTransactionsActionsList(
  transactionsHashes: string[]
): Promise<Map<string, Action[]>> {
  const transactionsActionsByHash = new Map<string, Action[]>();
  const transactionsActions = await queryTransactionsActionsList(
    transactionsHashes
  );
  if (transactionsActions.length === 0) {
    return transactionsActionsByHash;
  }
  transactionsActions.forEach((action) => {
    const txAction =
      transactionsActionsByHash.get(action.transaction_hash) || [];
    return transactionsActionsByHash.set(action.transaction_hash, [
      ...txAction,
      {
        kind: INDEXER_COMPATIBILITY_TRANSACTION_ACTION_KINDS.get(action.kind),
        args: convertDbArgsToRpcArgs(action.kind, action.args),
      } as Action,
    ]);
  });
  return transactionsActionsByHash;
}

export type Action<A extends RPC.ActionView = RPC.ActionView> =
  A extends Exclude<RPC.ActionView, "CreateAccount">
    ? {
        kind: keyof A;
        args: A[keyof A];
      }
    : {
        kind: "CreateAccount";
        args: {};
      };

export const mapRpcActionToAction = (action: RPC.ActionView): Action => {
  if (action === "CreateAccount") {
    return {
      kind: "CreateAccount",
      args: {},
    };
  }
  const kind = Object.keys(action)[0] as keyof Exclude<
    RPC.ActionView,
    "CreateAccount"
  >;
  return {
    kind,
    args: action[kind],
  } as Action;
};

type ReceiptExecutionOutcome = {
  tokens_burnt: string;
  logs: string[];
  outgoing_receipts?: NestedReceiptWithOutcome[];
  status: RPC.ExecutionStatusView;
  gas_burnt: number;
};

export type NestedReceiptWithOutcome = {
  actions?: Action[];
  block_hash: string;
  outcome: ReceiptExecutionOutcome;
  predecessor_id: string;
  receipt_id: string;
  receiver_id: string;
};

export const collectNestedReceiptWithOutcome = (
  receiptHash: string,
  receiptsByIdMap: Map<
    string,
    Omit<RPC.ReceiptView, "actions"> & { actions: Action[] }
  >,
  receiptOutcomesByIdMap: Map<string, RPC.ExecutionOutcomeWithIdView>
): NestedReceiptWithOutcome => {
  const receipt = receiptsByIdMap.get(receiptHash)!;
  const receiptOutcome = receiptOutcomesByIdMap.get(receiptHash)!;
  return {
    ...receipt,
    ...receiptOutcome,
    outcome: {
      ...receiptOutcome.outcome,
      outgoing_receipts: receiptOutcome.outcome.receipt_ids.map((id) =>
        collectNestedReceiptWithOutcome(
          id,
          receiptsByIdMap,
          receiptOutcomesByIdMap
        )
      ),
    },
  };
};

export const getDeposit = (actions: Action[]) =>
  actions
    .map((action) => {
      if ("deposit" in action.args) {
        return BigInt(action.args.deposit);
      } else {
        return 0n;
      }
    })
    .reduce((accumulator, deposit) => accumulator + deposit, 0n);

export const getTransactionFee = (
  transactionOutcome: TransactionOutcome,
  receiptsOutcome: RPC.ExecutionOutcomeWithIdView[]
) => {
  const tokensBurntByTx = BigInt(transactionOutcome.outcome.tokens_burnt);
  const tokensBurntByReceipts = receiptsOutcome
    .map((receipt) => BigInt(receipt.outcome.tokens_burnt))
    .reduce((tokenBurnt, currentFee) => tokenBurnt + currentFee, 0n);
  return tokensBurntByTx + tokensBurntByReceipts;
};

export type TransactionDetails = {
  hash: string;
  timestamp: number;
  signerId: string;
  receiverId: string;
  fee: string;
  amount: string;
  status: TransactionStatus;
};

export type TransactionStatus = "fetching" | "fail" | "success";
