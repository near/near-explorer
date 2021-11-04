import { ExplorerApi } from ".";

export interface BlocksListInfo {
  hash: string;
  height: number;
  timestamp: number;
  prevHash: string;
  transactionsCount: number;
}

export type BlockInfo = BlocksListInfo & {
  totalSupply: string;
  gasPrice: string;
  authorAccountId: string;
};

export type DetailedBlockInfo = BlockInfo & {
  gasUsed: string;
  receiptsCount: number;
};

export default class BlocksApi extends ExplorerApi {
  async getBlocks(
    limit = 15,
    paginationIndexer?: number
  ): Promise<BlocksListInfo[]> {
    return await this.call<BlocksListInfo[]>("blocks-list", [
      limit,
      paginationIndexer,
    ]);
  }

  async getBlockInfo(blockId: string | number): Promise<DetailedBlockInfo> {
    try {
      let receiptsCount;
      let gasUsedInBlock;
      const block = await this.call<BlockInfo>("block-info", [blockId]);

      if (block === undefined) {
        throw new Error("block not found");
      } else {
        const blockHash = block.hash;
        gasUsedInBlock = await this.call<string>("gas-used-in-chunks", [
          blockHash,
        ]);
        receiptsCount = await this.call<number>("receipts-count-in-block", [
          blockHash,
        ]);
      }

      return {
        ...block,
        gasUsed: gasUsedInBlock,
        receiptsCount,
      } as DetailedBlockInfo;
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
