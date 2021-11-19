import BN from "bn.js";
import { ExplorerApi } from ".";
export interface Block {
  hash: string;
  height: number;
  timestamp: number;
  prevHash: string;
  transactionsCount: number;
}

export type BlockInfo = Block & {
  totalSupply: BN;
  gasPrice: BN;
  authorAccountId: string;
  gasUsed: BN;
  receiptsCount: number;
};

export default class BlocksApi extends ExplorerApi {
  async getBlocks(limit = 15, paginationIndexer?: number): Promise<Block[]> {
    return await this.call<Block[]>("blocks-list", [limit, paginationIndexer]);
  }

  async getBlockInfo(blockId: string | number): Promise<BlockInfo> {
    try {
      const block = await this.call<BlockInfo>("block-info", [blockId]);
      if (!block) {
        throw new Error("block not found");
      }
      const [gasUsed, receiptsCount] = await Promise.all([
        this.getGasUsedInBlock(block.hash),
        this.call<number>("receipts-count-in-block", [block.hash]),
      ]);
      return {
        hash: block.hash,
        prevHash: block.prevHash,
        height: block.height,
        timestamp: block.timestamp,
        transactionsCount: block.transactionsCount,
        totalSupply: new BN(block.totalSupply),
        gasUsed: new BN(gasUsed),
        gasPrice: new BN(block.gasPrice),
        authorAccountId: block.authorAccountId,
        receiptsCount,
      };
    } catch (error) {
      console.error("Blocks.getBlockInfo failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getBlockByHashOrId(blockId: string | number): Promise<string> {
    return await this.call<string>("block-by-hash-or-id", [blockId]);
  }

  async getGasUsedInBlock(blockHash: string): Promise<string> {
    try {
      const gasUsed = await this.call<string>("gas-used-in-chunks", [
        blockHash,
      ]);
      if (!gasUsed) {
        throw new Error("gasUsed in block not found");
      }
      return gasUsed;
    } catch (error) {
      console.error("Blocks.getGasUsedInBlock failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }
}
