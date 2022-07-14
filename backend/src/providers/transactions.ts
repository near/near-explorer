import { RPC } from "../types";
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
import { ReceiptExecutionStatus } from "../utils/receipt-status";
import {
  mapDatabaseTransactionStatus,
  mapRpcTransactionStatus,
  TransactionStatus,
} from "../utils/transaction-status";
import {
  mapDatabaseActionToAction,
  Action,
  mapRpcActionToAction,
  DatabaseAction,
} from "../utils/actions";
import { nanosecondsToMilliseconds } from "../utils/bigint";

type TransactionPreview = {
  hash: string;
  signerId: string;
  receiverId: string;
  blockHash: string;
  blockTimestamp: number;
  actions: Action[];
  status: TransactionStatus;
};

type TransactionList = {
  items: TransactionPreview[];
  cursor: z.infer<typeof validators.transactionPagination>;
};

// helper function to init transactions list
// as we use the same structure but different queries for account, block, txInfo and list
async function createTransactionsList(
  transactions: Awaited<ReturnType<typeof queryTransactionsList>>
): Promise<TransactionList> {
  if (transactions.length === 0) {
    return {
      items: [],
      cursor: {
        timestamp: "",
        indexInChunk: 0,
      },
    };
  }

  const transactionsHashes = transactions.map(({ hash }) => hash);
  const transactionsActionsList = await getTransactionsActionsList(
    transactionsHashes
  );

  const lastTransaction = transactions[transactions.length - 1];
  return {
    items: transactions.map((transaction) => ({
      hash: transaction.hash,
      signerId: transaction.signer_id,
      receiverId: transaction.receiver_id,
      blockHash: transaction.block_hash,
      blockTimestamp: nanosecondsToMilliseconds(
        BigInt(transaction.block_timestamp)
      ),
      actions: transactionsActionsList.get(transaction.hash) || [],
      status: mapDatabaseTransactionStatus(transaction.status),
    })),
    cursor: {
      timestamp: lastTransaction.block_timestamp,
      indexInChunk: lastTransaction.transaction_index,
    },
  };
}

export const getIsTransactionIndexed = async (
  transactionHash: string
): Promise<boolean> => {
  const transaction = await queryIndexedTransaction(transactionHash);
  return Boolean(transaction?.transaction_hash);
};

export const getTransactionsList = async (
  limit: number | undefined,
  cursor?: z.infer<typeof validators.transactionPagination>
): Promise<TransactionList> => {
  const transactionsList = await queryTransactionsList(limit, cursor);
  return await createTransactionsList(transactionsList);
};

export const getAccountTransactionsList = async (
  accountId: string,
  limit: number | undefined,
  cursor?: z.infer<typeof validators.transactionPagination>
): Promise<TransactionList> => {
  const accountTxList = await queryAccountTransactionsList(
    accountId,
    limit,
    cursor
  );
  return await createTransactionsList(accountTxList);
};

export const getTransactionsListInBlock = async (
  blockHash: string,
  limit: number | undefined,
  cursor?: z.infer<typeof validators.transactionPagination>
): Promise<TransactionList> => {
  const txListInBlock = await queryTransactionsListInBlock(
    blockHash,
    limit,
    cursor
  );
  return await createTransactionsList(txListInBlock);
};

export const getTransactionInfo = async (
  transactionHash: string
): Promise<TransactionPreview | null> => {
  const transactionInfo = await queryTransactionInfo(transactionHash);
  if (!transactionInfo) {
    return null;
  }
  const transaction = await createTransactionsList([transactionInfo]);
  return transaction.items[0] || null;
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
    status: mapRpcTransactionStatus(transactionInfo.status),
  };
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
    const txAction = transactionsActionsByHash.get(action.hash) || [];
    return transactionsActionsByHash.set(action.hash, [
      ...txAction,
      mapDatabaseActionToAction(action as DatabaseAction),
    ]);
  });
  return transactionsActionsByHash;
}

type ReceiptExecutionOutcome = {
  tokens_burnt: string;
  logs: string[];
  outgoing_receipts?: NestedReceiptWithOutcome[];
  status: ReceiptExecutionStatus;
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
  receiptOutcomesByIdMap: Map<
    string,
    Omit<RPC.ExecutionOutcomeWithIdView, "outcome"> & {
      outcome: Omit<RPC.ExecutionOutcomeView, "status"> & {
        status: ReceiptExecutionStatus;
      };
    }
  >
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
  transactionOutcome: RPC.ExecutionOutcomeWithIdView,
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
