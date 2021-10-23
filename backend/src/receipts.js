const {
  queryReceiptsCountInBlock,
  queryTransactionHashByReceiptId,
} = require("./db-utils");

async function getReceiptsCountInBlock(blockHash) {
  // unused query
  return await queryReceiptsCountInBlock(blockHash);
}

async function getTransactionHashByReceiptId(receiptId) {
  const {
    receipt_id,
    originated_from_transaction_hash,
  } = await queryTransactionHashByReceiptId(receiptId);
  return {
    receiptId: receipt_id,
    originatedFromTransactionHash: originated_from_transaction_hash,
  };
}

exports.getReceiptsCountInBlock = getReceiptsCountInBlock;
exports.getTransactionHashByReceiptId = getTransactionHashByReceiptId;
