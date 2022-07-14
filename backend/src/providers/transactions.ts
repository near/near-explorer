import { RPC } from "../types";
import {
  queryTransactionInfo,
  queryIndexedTransaction,
} from "../database/queries";

import * as nearApi from "../utils/near";
import { ReceiptExecutionStatus } from "../utils/receipt-status";
import {
  mapRpcTransactionStatus,
  TransactionStatus,
} from "../utils/transaction-status";
import {
  Action,
  DatabaseAction,
  mapDatabaseActionToAction,
  mapRpcActionToAction,
} from "../utils/actions";
import { nanosecondsToMilliseconds } from "../utils/bigint";
import { indexerDatabase } from "../database/databases";

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
  const actions = await indexerDatabase
    .selectFrom("transaction_actions")
    .select(["transaction_hash as hash", "action_kind as kind", "args"])
    .where("transaction_hash", "=", transactionInfo.hash)
    .execute();
  return {
    hash: transactionInfo.hash,
    signerId: transactionInfo.signer_id,
    receiverId: transactionInfo.receiver_id,
    blockHash: transactionInfo.block_hash,
    blockTimestamp: nanosecondsToMilliseconds(
      BigInt(transactionInfo.block_timestamp)
    ),
    actions: actions.map((action) =>
      mapDatabaseActionToAction(action as DatabaseAction)
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
