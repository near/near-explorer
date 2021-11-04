const {
  queryReceiptsCountInBlock,
  queryTransactionHashByReceiptId,
  queryReceiptsList,
} = require("./db-utils");

const BN = require("bn.js");

const {
  getIndexerCompatibilityTransactionActionKinds,
} = require("./transactions");

const INDEXER_COMPATIBILITY_RECEIPT_ACTION_KINDS = new Map([
  ["SUCCESS_RECEIPT_ID", "SuccessReceiptId"],
  ["SUCCESS_VALUE", "SuccessValue"],
  ["FAILURE", "Failure"],
  [null, "Unknown"],
]);

async function getIndexerCompatibilityReceiptActionKinds() {
  return INDEXER_COMPATIBILITY_RECEIPT_ACTION_KINDS;
}

async function getReceiptsList(blockHash) {
  const receiptActions = await queryReceiptsList(blockHash);
  // The receipt actions are ordered in such a way that the actions for a single receipt go
  // one after another in a correct order, so we can collect them linearly using a moving
  // window based on the `previousReceiptId`.
  let receipts = [];
  let actions;
  let previousReceiptId = "";
  const indexerCompatibilityTransactionActionKinds = await getIndexerCompatibilityTransactionActionKinds();
  for (const receiptAction of receiptActions) {
    if (previousReceiptId !== receiptAction.receipt_id) {
      previousReceiptId = receiptAction.receipt_id;
      actions = [];
      const receipt = {
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
      };
      receipts.push(receipt);
    }
    actions.push({
      args: receiptAction.args,
      kind: indexerCompatibilityTransactionActionKinds.get(receiptAction.kind),
    });
  }

  return receipts;
}

async function getReceiptsCountInBlock(blockHash) {
  const receiptsCount = await queryReceiptsCountInBlock(blockHash);
  if (!receiptsCount) {
    return undefined;
  }
  return parseInt(receiptsCount.count);
}

async function getTransactionHashByReceiptId(receiptId) {
  const transactionInfo = await queryTransactionHashByReceiptId(receiptId);
  if (!transactionInfo) {
    return undefined;
  }
  return {
    receiptId: transactionInfo.receipt_id,
    originatedFromTransactionHash:
      transactionInfo.originated_from_transaction_hash,
  };
}

exports.getReceiptsCountInBlock = getReceiptsCountInBlock;
exports.getTransactionHashByReceiptId = getTransactionHashByReceiptId;
exports.getIndexerCompatibilityReceiptActionKinds = getIndexerCompatibilityReceiptActionKinds;
exports.getReceiptsList = getReceiptsList;
