import { ExplorerApi } from ".";

export interface Block {
  hash: string;
  height: number;
  timestamp: number;
  prevHash: string;
  transactionsCount: number;
}

export type BlockInfo = Block & {
  totalSupply: string;
  gasPrice: string;
  authorAccountId: string;
  gasUsed: string;
  receiptsCount: number;
};

export default class BlocksApi extends ExplorerApi {
  async getBlocks(limit = 15, paginationIndexer?: number): Promise<Block[]> {
    return await this.call<Block[]>("blocks-list", [limit, paginationIndexer]);
  }

  async getBlockInfo(blockId: string | number): Promise<BlockInfo> {
    try {
      const block = await this.call<BlockInfo>("block-info", [blockId]);
      if (block === undefined) {
        throw new Error("block not found");
      }
      return block;
    } catch (error) {
      console.error("Blocks.getBlockInfo failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getBlockByHashOrId(blockId: string | number): Promise<string> {
    return await this.call<string>("block-by-hash-or-id", [blockId]);
  }
}
