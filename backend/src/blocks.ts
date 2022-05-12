import { BlockBase, BlockInfo } from "./client-types";
import {
  queryBlocksList,
  queryBlockInfo,
  queryBlockByHashOrId,
} from "./db-utils";

async function getBlocksList(
  limit: number,
  paginationIndexer?: number
): Promise<BlockBase[]> {
  const blocksList = await queryBlocksList(limit, paginationIndexer);
  return blocksList.map((block) => ({
    hash: block.hash,
    height: parseInt(block.height),
    timestamp: parseInt(block.timestamp),
    prevHash: block.prev_hash,
    transactionsCount: parseInt(block.transactions_count),
  }));
}

async function getBlockInfo(
  blockId: string | number
): Promise<BlockInfo | null> {
  const blockInfo = await queryBlockInfo(blockId);
  if (!blockInfo) {
    return null;
  }
  return {
    hash: blockInfo.hash,
    prevHash: blockInfo.prev_hash,
    height: parseInt(blockInfo.height),
    timestamp: parseInt(blockInfo.timestamp),
    transactionsCount: parseInt(blockInfo.transactions_count),
    totalSupply: blockInfo.total_supply,
    gasPrice: blockInfo.gas_price,
    authorAccountId: blockInfo.author_account_id,
  };
}

async function getBlockByHashOrId(
  blockId: string | number
): Promise<string | null> {
  const block = await queryBlockByHashOrId(blockId);
  if (!block) {
    return null;
  }
  return block.block_hash;
}

export { getBlocksList, getBlockInfo, getBlockByHashOrId };
