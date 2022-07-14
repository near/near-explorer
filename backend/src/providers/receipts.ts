import {
  queryReceiptInTransaction,
  queryIncludedReceiptsList,
  queryExecutedReceiptsList,
} from "../database/queries";

import { nanosecondsToMilliseconds } from "../utils/bigint";
import {
  Action,
  DatabaseAction,
  mapDatabaseActionToAction,
} from "../utils/actions";
import {
  mapDatabaseReceiptStatus,
  ReceiptExecutionStatus,
} from "../utils/receipt-status";

export type Receipt = {
  actions: Action[];
  blockTimestamp: number;
  receiptId: string;
  gasBurnt: string;
  receiverId: string;
  signerId: string;
  status: ReceiptExecutionStatus["type"];
  originatedFromTransactionHash: string;
  tokensBurnt: string;
};

function groupReceiptActionsIntoReceipts(
  receiptActions: Awaited<ReturnType<typeof queryIncludedReceiptsList>>
): Receipt[] {
  // The receipt actions are ordered in such a way that the actions for a single receipt go
  // one after another in a correct order, so we can collect them linearly using a moving
  // window based on the `previousReceiptId`.
  const receipts: Receipt[] = [];
  let actions: Action[] = [];
  let previousReceiptId = "";
  for (const receiptAction of receiptActions) {
    if (previousReceiptId !== receiptAction.receipt_id) {
      previousReceiptId = receiptAction.receipt_id;
      actions = [];
      receipts.push({
        actions,
        blockTimestamp: nanosecondsToMilliseconds(
          BigInt(receiptAction.executed_in_block_timestamp)
        ),
        gasBurnt: receiptAction.gas_burnt,
        receiptId: receiptAction.receipt_id,
        receiverId: receiptAction.receiver_id,
        signerId: receiptAction.predecessor_id,
        status: mapDatabaseReceiptStatus(receiptAction.status),
        originatedFromTransactionHash:
          receiptAction.originated_from_transaction_hash,
        tokensBurnt: receiptAction.tokens_burnt,
      });
    }
    actions.push(
      mapDatabaseActionToAction({
        ...receiptAction,
        hash: receiptAction.originated_from_transaction_hash,
      } as DatabaseAction)
    );
  }

  return receipts;
}

// As a temporary solution we split receipts list into two lists:
// included in block and executed in block
// more info here https://github.com/near/near-explorer/pull/868
export const getIncludedReceiptsList = async (
  blockHash: string
): Promise<Receipt[]> => {
  const receiptActions = await queryIncludedReceiptsList(blockHash);
  return groupReceiptActionsIntoReceipts(receiptActions);
};

export const getExecutedReceiptsList = async (
  blockHash: string
): Promise<Receipt[]> => {
  const receiptActions = await queryExecutedReceiptsList(blockHash);
  return groupReceiptActionsIntoReceipts(receiptActions);
};

export type TransactionHashByReceiptId = {
  receiptId: string;
  originatedFromTransactionHash: string;
};

export const getReceiptInTransaction = async (
  receiptId: string
): Promise<TransactionHashByReceiptId | null> => {
  const transactionInfo = await queryReceiptInTransaction(receiptId);
  if (!transactionInfo) {
    return null;
  }
  return {
    receiptId: transactionInfo.receipt_id,
    originatedFromTransactionHash:
      transactionInfo.originated_from_transaction_hash,
  };
};
