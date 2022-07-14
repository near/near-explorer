import { RPC } from "../types";
import {
  queryTransactionInfo,
  queryIndexedTransaction,
} from "../database/queries";

import * as nearApi from "../utils/near";
import {
  mapRpcReceiptStatus,
  ReceiptExecutionStatus,
} from "../utils/receipt-status";
import {
  mapRpcTransactionStatus,
  TransactionStatus,
} from "../utils/transaction-status";
import { Action, mapRpcActionToAction } from "../utils/actions";
import { nanosecondsToMilliseconds } from "../utils/bigint";

export const getIsTransactionIndexed = async (
  transactionHash: string
): Promise<boolean> => {
  const transaction = await queryIndexedTransaction(transactionHash);
  return Boolean(transaction?.transaction_hash);
};

export const getTransactionInfo = async (transactionHash: string) => {
  const transactionInfo = await queryTransactionInfo(transactionHash);
  if (!transactionInfo) {
    return null;
  }
  return {
    hash: transactionInfo.hash,
    signerId: transactionInfo.signer_id,
    blockHash: transactionInfo.block_hash,
    blockTimestamp: nanosecondsToMilliseconds(
      BigInt(transactionInfo.block_timestamp)
    ),
  };
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

type ReceiptExecutionOutcome = {
  blockHash: string;
  tokensBurnt: string;
  logs: string[];
  nestedReceipts: NestedReceiptWithOutcome[];
  status: ReceiptExecutionStatus;
  gasBurnt: number;
};

export type NestedReceiptWithOutcome = {
  actions: Action[];
  outcome: ReceiptExecutionOutcome;
  predecessorId: string;
  id: string;
  receiverId: string;
};

export const collectNestedReceiptWithOutcome = (
  receiptHash: string,
  receiptsByIdMap: Map<string, RPC.ReceiptView>,
  receiptOutcomesByIdMap: Map<string, RPC.ExecutionOutcomeWithIdView>
): NestedReceiptWithOutcome => {
  const receipt = receiptsByIdMap.get(receiptHash)!;
  const receiptOutcome = receiptOutcomesByIdMap.get(receiptHash)!;
  return {
    id: receipt.receipt_id,
    receiverId: receipt.receiver_id,
    predecessorId: receipt.predecessor_id,
    actions:
      "Action" in receipt.receipt
        ? receipt.receipt.Action.actions.map(mapRpcActionToAction)
        : [],
    outcome: {
      blockHash: receiptOutcome.block_hash,
      tokensBurnt: receiptOutcome.outcome.tokens_burnt,
      logs: receiptOutcome.outcome.logs,
      status: mapRpcReceiptStatus(receiptOutcome.outcome.status),
      gasBurnt: receiptOutcome.outcome.gas_burnt,
      nestedReceipts: receiptOutcome.outcome.receipt_ids.map((id) =>
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
