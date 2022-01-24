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

const generateProperReceiptsList = async (receiptsList) => {
  let receipts = [];
  let actions;
  let previousReceiptId = "";
  const indexerCompatibilityTransactionActionKinds = await getIndexerCompatibilityTransactionActionKinds();
  for (const receiptAction of receiptsList) {
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
};

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

async function getExucutedReceiptsList(blockHash) {
  const receiptActions = await queryExecutedReceiptsList(blockHash);
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

async function getIncludedAndExecutedReceiptsList(blockHash) {
  let receiptsList = [];
  const receiptsIncludedInBlockMap = new Map();
  const receiptsExecutedInBlockMap = new Map();

  const receiptsIncludedInBlock = await generateProperReceiptsList(
    await queryReceiptsList(blockHash)
  );
  const receiptsExecutedInBlock = await generateProperReceiptsList(
    await queryExecutedReceiptsList(blockHash)
  );
  const receiptsIdsSet = new Set([
    ...receiptsIncludedInBlock.map(({ receiptId }) => receiptId),
    ...receiptsExecutedInBlock.map(({ receiptId }) => receiptId),
  ]);

  if (receiptsIdsSet.size === 0) {
    return receiptsList;
  }

  receiptsIncludedInBlock.forEach((receipt) => {
    receiptsIncludedInBlockMap.set(receipt.receiptId, receipt);
  });
  receiptsExecutedInBlock.forEach((receipt) => {
    receiptsExecutedInBlockMap.set(receipt.receiptId, receipt);
  });

  for (receiptId of receiptsIdsSet) {
    const includedReceipt = receiptsIncludedInBlockMap.get(receiptId);
    const executedReceipt = receiptsExecutedInBlockMap.get(receiptId);

    if (!includedReceipt && executedReceipt) {
      receiptsList.push({
        ...executedReceipt,
        executionStatus: "executed",
      });
    } else if (includedReceipt && !executedReceipt) {
      receiptsList.push({
        ...includedReceipt,
        executionStatus: "delayed",
      });
    } else {
      receiptsList.push({
        ...includedReceipt,
        executionStatus: "success",
      });
    }
  }
  return receiptsList;
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
exports.getIncludedAndExecutedReceiptsList = getIncludedAndExecutedReceiptsList;
