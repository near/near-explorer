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
    let block;
    try {
      block = await this.call<BlockInfo>("block-info", [blockId]);
    } catch (error) {
      console.error("BlocksApi.getBlockInfo failed to fetch data due to:");
      console.error(error);
      throw error;
    }

    if (!block) {
      throw new Error(`BlocksApi.getBlockInfo: block '${blockId}' not found`);
    }
    const [gasUsed, receiptsCount] = await Promise.all([
      this.getGasUsedInBlock(block.hash).catch(() => new BN(0)),
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
  }

  async getBlockByHashOrId(blockId: string | number): Promise<string> {
    return await this.call<string>("block-by-hash-or-id", [blockId]);
  }

  async getGasUsedInBlock(blockHash: string): Promise<string> {
    let gasUsed;
    try {
      gasUsed = await this.call<string>("gas-used-in-chunks", [blockHash]);
    } catch (error) {
      console.error("BlocksApi.getGasUsedInBlock failed to fetch data due to:");
      console.error(error);
      throw error;
    }
    if (!gasUsed) {
      throw new Error(
        `BlocksApi.getGasUsedInBlock: failed to fetch gasUsed in block '${blockHash}'`
      );
    }
    return gasUsed;
  }
}
