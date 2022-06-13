import { RPC, TransactionOutcome, KeysOfUnion } from "../types";
import {
  queryIndexedTransaction,
  queryTransactionsList,
  queryTransactionsActionsList,
  queryAccountTransactionsList,
  queryTransactionsListInBlock,
  queryTransactionInfo,
  queryTransactionsByHashes,
} from "../database/queries";
import { z } from "zod";
import { validators } from "../router/validators";

import { getBlockHeightsByHashes } from "./blocks";

import { sendJsonRpc } from "../utils/near";

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

export const getTransactionsByHashes = async (
  hashes: string[]
): Promise<Map<string, TransactionBaseInfo>> => {
  if (hashes.length === 0) {
    return new Map();
  }
  const rawTransactions = await queryTransactionsByHashes(hashes);
  if (rawTransactions.length === 0) {
    return new Map();
  }
  const transactions = await createTransactionsList(rawTransactions);
  return transactions.reduce((acc, transaction) => {
    acc.set(transaction.hash, transaction);
    return acc;
  }, new Map());
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
    throw new Error(`No hash ${transactionHash} found`);
  }
  const transactionInfo = await sendJsonRpc("EXPERIMENTAL_tx_status", [
    transactionBaseInfo.hash,
    transactionBaseInfo.signerId,
  ]);
  const blockHashes = transactionInfo.receipts_outcome.map(
    (receipt) => receipt.block_hash
  );
  const blockHeights = await getBlockHeightsByHashes(blockHashes);
  const includedInBlockMap = blockHeights.reduce((acc, block) => {
    acc.set(block.blockHash, {
      blockHeight: block.blockHeight,
      blockTimestamp: block.blockTimestamp,
    });
    return acc;
  }, new Map());
  const receiptsOutcome = transactionInfo.receipts_outcome.map((receipt) => ({
    id: receipt.id,
    proof: receipt.proof,
    outcome: receipt.outcome,
    includedInBlock: {
      hash: receipt.block_hash,
      height: includedInBlockMap.get(receipt.block_hash).blockHeight,
      timestamp: includedInBlockMap.get(receipt.block_hash).blockTimestamp,
    },
  }));

  if (
    transactionInfo.receipts.length === 0 ||
    transactionInfo.receipts[0].receipt_id !== receiptsOutcome[0].id
  ) {
    transactionInfo.receipts.unshift({
      predecessor_id: transactionInfo.transaction.signer_id,
      receipt: {
        Action: {
          signer_id: transactionInfo.transaction.signer_id,
          signer_public_key: "",
          gas_price: "0",
          output_data_receivers: [],
          input_data_ids: [],
          actions: transactionInfo.transaction.actions,
        },
      },
      receipt_id: receiptsOutcome[0].id,
      receiver_id: transactionInfo.transaction.receiver_id,
    });
  }

  const receiptOutcomesByIdMap = receiptsOutcome.reduce(
    (acc: Map<string, ReceiptsOutcome>, receipt) => {
      acc.set(receipt.id, receipt);
      return acc;
    },
    new Map()
  );
  const receiptsByIdMap = transactionInfo.receipts.reduce(
    (
      acc: Map<
        string,
        Omit<RPC.ReceiptView, "actions"> & { actions: Action[] }
      >,
      receiptItem
    ) => {
      acc.set(receiptItem.receipt_id, {
        ...receiptItem,
        actions:
          "Action" in receiptItem.receipt
            ? receiptItem.receipt.Action.actions.map(mapRpcActionToAction)
            : [],
      });
      return acc;
    },
    new Map()
  );
  const refundReceiptsMap: Map<string, any> = new Map();

  const gasUsed = getGasUsed(
    transactionInfo.transaction_outcome,
    receiptsOutcome
  );
  const txActions =
    transactionInfo.transaction.actions.map(mapRpcActionToAction);
  const gasAttached = getGasAttached(gasUsed, txActions);
  const transactionFee = getTransactionFee(
    transactionInfo.transaction_outcome,
    receiptsOutcome
  );
  const transactionAmount = getDeposit(txActions);

  return {
    hash: transactionHash,
    created: {
      timestamp: transactionBaseInfo.blockTimestamp,
      blockHash: transactionBaseInfo.blockHash,
    },
    transaction: transactionInfo.transaction,
    transactionIndex: transactionBaseInfo.transactionIndex,
    transactionOutcome: transactionInfo.transaction_outcome,
    transactionFee,
    transactionAmount,
    status: Object.keys(transactionInfo.status)[0] as any, // need to resolve
    gasUsed,
    gasAttached,
    receipt: collectReceiptsWithOutcome(
      receiptsOutcome[0].id,
      null,
      refundReceiptsMap,
      receiptsByIdMap,
      receiptOutcomesByIdMap
    ),
    refundReceipts: [...refundReceiptsMap.values()],
  };
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

const collectReceiptsWithOutcome = (
  receiptHash: string,
  parentReceiptHash: string | null = null,
  refundReceiptsMap: Map<string, TransactionReceipt>,
  receiptsByIdMap: Map<
    string,
    Omit<RPC.ReceiptView, "actions"> & { actions: Action[] }
  >,
  receiptOutcomesByIdMap: Map<string, ReceiptsOutcome>
): TransactionReceipt => {
  const receipt = receiptsByIdMap.get(receiptHash)!;
  const receiptOutcome = receiptOutcomesByIdMap.get(receiptHash)!;

  return {
    actions: receipt.actions,
    deposit: getDeposit(receipt.actions ?? []) || null,
    signerId: receipt.predecessor_id, // do we need to rename 'signerId' to 'predecessor_id'?
    parentReceiptHash,
    includedInBlock: receiptOutcome.includedInBlock, // executed in block
    receiptId: receiptOutcome.id,
    receiverId: receiptOutcome.outcome.executor_id,
    gasBurnt: receiptOutcome.outcome.gas_burnt,
    tokensBurnt: receiptOutcome.outcome.tokens_burnt,
    logs: receiptOutcome.outcome.logs || [],
    status: receiptOutcome.outcome.status,
    outgoingReceipts: receiptOutcome.outcome.receipt_ids
      .map((outcomeReceiptHash) => {
        const outcomeReceipt = receiptsByIdMap.get(outcomeReceiptHash);
        if (outcomeReceipt && outcomeReceipt.predecessor_id === "system") {
          refundReceiptsMap.set(
            outcomeReceiptHash,
            collectReceiptsWithOutcome(
              outcomeReceiptHash,
              receiptOutcome.id,
              refundReceiptsMap,
              receiptsByIdMap,
              receiptOutcomesByIdMap
            )
          );
          return null;
        } else {
          return collectReceiptsWithOutcome(
            outcomeReceiptHash,
            receiptOutcome.id,
            refundReceiptsMap,
            receiptsByIdMap,
            receiptOutcomesByIdMap
          );
        }
      })
      .filter((i) => i !== null) as any,
  };
};

export const getDeposit = (actions: Action[]) =>
  actions
    .map((action: Action) => {
      if ("deposit" in action.args) {
        return BigInt(action.args.deposit);
      } else {
        return 0n;
      }
    })
    .reduce((accumulator, deposit) => accumulator + deposit, 0n)
    .toString();

export const getGasUsed = (
  transactionOutcome: TransactionOutcome,
  receiptsOutcome: ReceiptsOutcome[]
) => {
  const gasBurntByTx = transactionOutcome
    ? BigInt(transactionOutcome.outcome.gas_burnt)
    : 0n;
  const gasBurntByReceipts = receiptsOutcome
    ? receiptsOutcome
        .map((receipt: ReceiptsOutcome) => BigInt(receipt.outcome.gas_burnt))
        .reduce((gasBurnt, currentFee) => gasBurnt + currentFee, 0n)
    : 0n;
  return (gasBurntByTx + gasBurntByReceipts).toString();
};

export const getGasAttached = (
  gasUsed: string,
  transactionActions: Action[]
) => {
  const gasAttached = transactionActions
    .map((action) => {
      if ("gas" in action.args) {
        return BigInt(action.args.gas);
      } else {
        return 0n;
      }
    })
    .reduce((accumulator, gas) => accumulator + gas, 0n)
    .toString();
  return gasAttached ?? gasUsed;
};

export const getTransactionFee = (
  transactionOutcome: TransactionOutcome,
  receiptsOutcome: ReceiptsOutcome[]
) => {
  const tokensBurntByTx = transactionOutcome
    ? BigInt(transactionOutcome.outcome.tokens_burnt)
    : 0n;
  const tokensBurntByReceipts = receiptsOutcome
    ? receiptsOutcome
        .map((receipt) => BigInt(receipt.outcome.tokens_burnt))
        .reduce((tokenBurnt, currentFee) => tokenBurnt + currentFee, 0n)
    : 0n;
  return (tokensBurntByTx + tokensBurntByReceipts).toString();
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

export type TransactionDetails = {
  hash: string;
  created: {
    timestamp: number;
    blockHash: string;
  };
  transaction: RPC.SignedTransactionView;
  transactionIndex: number;
  transactionFee: string;
  transactionAmount: string;
  transactionOutcome: RPC.ExecutionOutcomeWithIdView;
  status: KeysOfUnion<RPC.FinalExecutionStatus>;
  gasUsed: string;
  gasAttached: string;
  receipt: TransactionReceipt;
  refundReceipts: TransactionReceipt[];
};

export type TransactionBlockInfo = {
  hash: string;
  height: number;
  timestamp: number;
};
export type ReceiptsOutcome = Omit<
  RPC.ExecutionOutcomeWithIdView,
  "block_hash"
> & { includedInBlock: TransactionBlockInfo };

export type TransactionReceipt = {
  actions: Action[];
  deposit: string | null;
  signerId: string;
  parentReceiptHash: string | null;
  includedInBlock: TransactionBlockInfo;
  receiptId: string;
  receiverId: string;
  gasBurnt?: number;
  tokensBurnt: string;
  logs: string[] | [];
  status: RPC.ExecutionStatusView;
  outgoingReceipts: TransactionReceipt[] | [];
};
