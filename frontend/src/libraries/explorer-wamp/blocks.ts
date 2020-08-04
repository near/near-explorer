import { ExplorerApi } from ".";
import BN from "bn.js";

export interface BlockInfo {
  hash: string;
  height: number;
  timestamp: number;
  prevHash: string;
  transactionsCount: number;
  gasPrice: string;
  gasUsed?: string;
  isFinal?: boolean;
}

export default class BlocksApi extends ExplorerApi {
  async searchBlocks(keyword: string, height = -1, limit = 15) {
    try {
      return await this.call("select", [
        `SELECT blocks.*, COUNT(transactions.hash) as transactionsCount
          FROM (
            SELECT blocks.hash, blocks.height, blocks.timestamp, blocks.prev_hash as prevHash FROM blocks
            WHERE blocks.height LIKE :keyword AND blocks.height < :height
          ) as blocks
          LEFT JOIN transactions ON transactions.block_hash = blocks.hash
          GROUP BY blocks.hash
          ORDER BY blocks.height DESC`,
        {
          keyword: `${keyword}%`,
          height: height === -1 ? "MAX(blocks.height)" : height,
          limit,
        },
      ]);
    } catch (error) {
      console.error("Blocks.searchBlocks failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getBlocks(
    limit = 15,
    paginationIndexer?: number
  ): Promise<BlockInfo[]> {
    try {
      const blocks = await this.call<any>("select", [
        `SELECT blocks.*, COUNT(transactions.hash) as transactionsCount
          FROM (
            SELECT blocks.hash, blocks.height, blocks.timestamp, blocks.prev_hash as prevHash 
            FROM blocks
            ${
              paginationIndexer
                ? `WHERE blocks.timestamp < :paginationIndexer`
                : ""
            }
            ORDER BY blocks.height DESC
            LIMIT :limit
          ) as blocks
          LEFT JOIN transactions ON transactions.block_hash = blocks.hash
          GROUP BY blocks.hash
          ORDER BY blocks.timestamp DESC`,
        {
          limit,
          paginationIndexer,
        },
      ]);

      return blocks as BlockInfo[];
    } catch (error) {
      console.error("Blocks.getBlocks failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getLatestBlocksInfo(limit: number = 8): Promise<BlockInfo[]> {
    return this.getBlocks(limit);
  }

  async getBlockInfo(blockId: string): Promise<BlockInfo> {
    try {
      const block = await this.call<any>("select", [
        `SELECT blocks.*, COUNT(transactions.hash) as transactionsCount
          FROM (
            SELECT blocks.hash, blocks.height, blocks.timestamp, blocks.prev_hash as prevHash, 
                  blocks.gas_price as gasPrice
            FROM blocks
            WHERE blocks.hash = :blockId OR blocks.height = :blockId
          ) as blocks
          LEFT JOIN transactions ON transactions.block_hash = blocks.hash`,
        {
          blockId,
        },
      ]).then((it) => (it[0].hash !== null ? it[0] : null));

      if (block === null) {
        throw new Error("block not found");
      } else {
        let gasUsedResult = await this.call<any>("select", [
          `SELECT gas_used as gasUsed FROM chunks WHERE block_hash = :block_hash AND height_included = :block_height`,
          {
            block_hash: block.hash,
            block_height: block.height,
          },
        ]);
        let gasUsedArray = gasUsedResult.map((gas: any) => new BN(gas.gasUsed));
        let gasUsed = gasUsedArray.reduce(
          (gas: BN, currentGas: BN) => gas.add(currentGas),
          new BN(0)
        );
        block.gasUsed = gasUsed.toString();
      }

      return block as BlockInfo;
    } catch (error) {
      console.error("Blocks.getBlockInfo failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async queryFinalHeight(): Promise<any> {
    const finalBlock = await this.call<any>("nearcore-final-block");
    return finalBlock.header.height;
  }
}
