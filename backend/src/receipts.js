const {
  queryReceiptsCountInBlock,
  queryReceiptInTransaction,
  queryReceiptsList,
  queryExecutedReceiptsList,
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

async function generateProperReceiptsList(receiptsList) {
  // The receipt actions are ordered in such a way that the actions for a single receipt go
  // one after another in a correct order, so we can collect them linearly using a moving
  // window based on the `previousReceiptId`.
  let receipts = [];
  let actions;
  let previousReceiptId = "";
  const indexerCompatibilityTransactionActionKinds = await getIndexerCompatibilityTransactionActionKinds();
  for (const receiptItem of receiptsList) {
    if (previousReceiptId !== receiptItem.receipt_id) {
      previousReceiptId = receiptItem.receipt_id;
      actions = [];
      const receipt = {
        actions,
        blockTimestamp: new BN(receiptItem.executed_in_block_timestamp)
          .divn(10 ** 6)
          .toNumber(),
        gasBurnt: receiptItem.gas_burnt,
        receiptId: receiptItem.receipt_id,
        receiverId: receiptItem.receiver_id,
        signerId: receiptItem.predecessor_id,
        status: INDEXER_COMPATIBILITY_RECEIPT_ACTION_KINDS.get(
          receiptItem.status
        ),
        originatedFromTransactionHash:
          receiptItem.originated_from_transaction_hash,
        tokensBurnt: receiptItem.tokens_burnt,
      };
      receipts.push(receipt);
    }
    actions.push({
      args: receiptItem.args,
      kind: indexerCompatibilityTransactionActionKinds.get(receiptItem.kind),
    });
  }

  return receipts;
}

// As a temporary solution we split receipts list into two lists:
// included in block and executed in block
async function getReceiptsList(blockHash) {
  const receiptActions = await queryReceiptsList(blockHash);
  return await generateProperReceiptsList(receiptActions);
}

async function getExucutedReceiptsList(blockHash) {
  const receiptActions = await queryExecutedReceiptsList(blockHash);
  return await generateProperReceiptsList(receiptActions);
}

async function getReceiptsCountInBlock(blockHash) {
  const receiptsCount = await queryReceiptsCountInBlock(blockHash);
  if (!receiptsCount) {
    return undefined;
  }
  return parseInt(receiptsCount.count);
}

async function getReceiptInTransaction(receiptId) {
  const transactionInfo = await queryReceiptInTransaction(receiptId);
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
exports.getReceiptInTransaction = getReceiptInTransaction;
exports.getIndexerCompatibilityReceiptActionKinds = getIndexerCompatibilityReceiptActionKinds;
exports.getReceiptsList = getReceiptsList;
exports.getExucutedReceiptsList = getExucutedReceiptsList;
