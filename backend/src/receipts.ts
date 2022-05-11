import {
  queryReceiptsCountInBlock,
  queryReceiptInTransaction,
  queryIncludedReceiptsList,
  queryExecutedReceiptsList,
} from "./db-utils";

import BN from "bn.js";

import {
  convertDbArgsToRpcArgs,
  getIndexerCompatibilityTransactionActionKinds,
} from "./transactions";
import {
  Action,
  Receipt,
  ReceiptExecutionStatus,
  TransactionHashByReceiptId,
} from "./types";

const INDEXER_COMPATIBILITY_RECEIPT_ACTION_KINDS = new Map<
  string | null,
  ReceiptExecutionStatus
>([
  ["SUCCESS_RECEIPT_ID", "SuccessReceiptId"],
  ["SUCCESS_VALUE", "SuccessValue"],
  ["FAILURE", "Failure"],
  [null, "Unknown"],
]);

export const getIndexerCompatibilityReceiptActionKinds = () => {
  return INDEXER_COMPATIBILITY_RECEIPT_ACTION_KINDS;
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
  const indexerCompatibilityTransactionActionKinds = getIndexerCompatibilityTransactionActionKinds();
  for (const receiptAction of receiptActions) {
    if (previousReceiptId !== receiptAction.receipt_id) {
      previousReceiptId = receiptAction.receipt_id;
      actions = [];
      receipts.push({
        actions,
        blockTimestamp: new BN(receiptAction.executed_in_block_timestamp)
          .divn(10 ** 6)
          .toNumber(),
        gasBurnt: receiptAction.gas_burnt,
        receiptId: receiptAction.receipt_id,
        receiverId: receiptAction.receiver_id,
        signerId: receiptAction.predecessor_id,
        status: INDEXER_COMPATIBILITY_RECEIPT_ACTION_KINDS.get(
          receiptAction.status
        ),
        originatedFromTransactionHash:
          receiptAction.originated_from_transaction_hash,
        tokensBurnt: receiptAction.tokens_burnt,
      });
    }
    actions.push({
      args: convertDbArgsToRpcArgs(receiptAction.kind, receiptAction.args),
      kind: indexerCompatibilityTransactionActionKinds.get(receiptAction.kind)!,
    } as Action);
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

export const getReceiptsCountInBlock = async (
  blockHash: string
): Promise<number | null> => {
  const receiptsCount = await queryReceiptsCountInBlock(blockHash);
  if (!receiptsCount) {
    return null;
  }
  return parseInt(receiptsCount.count);
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
