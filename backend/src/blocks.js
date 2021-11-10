const {
  queryBlocksList,
  queryBlockInfo,
  queryBlockByHashOrId,
} = require("./db-utils");
const { getGasUsedInChunks } = require("./chunks");
const { getReceiptsCountInBlock } = require("./receipts");

async function getBlocksList(limit, paginationIndexer) {
  const blocksList = await queryBlocksList(limit, paginationIndexer);
  return blocksList.map((block) => ({
    hash: block.hash,
    height: parseInt(block.height),
    timestamp: parseInt(block.timestamp),
    prevHash: block.prev_hash,
    transactionsCount: parseInt(block.transactions_count),
  }));
}

async function getBlockInfo(blockId) {
  const blockHash = await getBlockByHashOrId(blockId);
  if (!blockHash) {
    return undefined;
  }
  const [blockInfo, gasUsed, receiptsCount] = await Promise.all([
    queryBlockInfo(blockHash),
    getGasUsedInChunks(blockHash),
    getReceiptsCountInBlock(blockHash),
  ]);
  return {
    hash: blockInfo.hash,
    prevHash: blockInfo.prev_hash,
    height: parseInt(blockInfo.height),
    timestamp: parseInt(blockInfo.timestamp),
    transactionsCount: parseInt(blockInfo.transactions_count),
    totalSupply: blockInfo.total_supply,
    gasPrice: blockInfo.gas_price,
    authorAccountId: blockInfo.author_account_id,
    receiptsCount,
    gasUsed,
  };
}

async function getBlockByHashOrId(blockId) {
  const block = await queryBlockByHashOrId(blockId);
  if (!block) {
    return undefined;
  }
  return block.block_hash;
}

exports.getBlocksList = getBlocksList;
exports.getBlockInfo = getBlockInfo;
exports.getBlockByHashOrId = getBlockByHashOrId;
