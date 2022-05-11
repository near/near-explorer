import { BlockBase, Block } from "./client-types";
import {
  queryBlocksList,
  queryBlockInfo,
  queryBlockByHashOrId,
} from "./db-utils";

export const getBlocksList = async (
  limit: number,
  paginationIndexer: number | null
): Promise<BlockBase[]> => {
  const blocksList = await queryBlocksList(limit, paginationIndexer);
  return blocksList.map((block) => ({
    hash: block.hash,
    height: parseInt(block.height),
    timestamp: parseInt(block.timestamp),
    prevHash: block.prev_hash,
    transactionsCount: parseInt(block.transactions_count),
  }));
};

export const getBlockInfo = async (
  blockId: string | number
): Promise<Omit<Block, "gasUsed" | "receiptsCount"> | null> => {
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
};

export const getBlockByHashOrId = async (
  blockId: string | number
): Promise<string | null> => {
  const block = await queryBlockByHashOrId(blockId);
  if (!block) {
    return null;
  }
  return block.block_hash;
};
