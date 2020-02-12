import { ExplorerApi } from ".";

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
          limit
        }
      ]);
    } catch (error) {
      console.error("Blocks.searchBlocks failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getTotal(): Promise<number> {
    try {
      return await this.call("select", [
        `SELECT COUNT(blocks.hash) AS total FROM blocks`
      ]);
    } catch (error) {
      console.error("Blocks.getTotal failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getLatestBlocksInfo(limit = 15) {
    try {
      return await this.call("select", [
        `SELECT blocks.*, COUNT(transactions.hash) as transactionsCount
          FROM (
            SELECT blocks.hash, blocks.height, blocks.timestamp, blocks.prev_hash as prevHash FROM blocks
            ORDER BY blocks.height DESC
            LIMIT :limit
          ) as blocks
          LEFT JOIN transactions ON transactions.block_hash = blocks.hash
          GROUP BY blocks.hash
          ORDER BY blocks.height DESC`,
        {
          limit
        }
      ]);
    } catch (error) {
      console.error("Blocks.getBlocksInfo[] failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getBlockInfo(blockId: string) {
    try {
      const block = await this.call("select", [
        `SELECT blocks.*, COUNT(transactions.hash) as transactionsCount
          FROM (
            SELECT blocks.hash, blocks.height, blocks.timestamp, blocks.prev_hash as prevHash
            FROM blocks
            WHERE blocks.hash = :blockId OR blocks.height = :blockId
          ) as blocks
          LEFT JOIN transactions ON transactions.block_hash = blocks.hash`,
        {
          blockId
        }
      ]).then((it: any) => (it[0].hash !== null ? it[0] : null));

      if (block === null) {
        throw new Error("block not found");
      }
      return block;
    } catch (error) {
      console.error("Blocks.getBlockInfo failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getPreviousBlocks(lastBlockHeight: string, limit = 15) {
    try {
      return await this.call("select", [
        `SELECT blocks.*, COUNT(transactions.hash) as transactionsCount
          FROM (
            SELECT blocks.hash, blocks.height, blocks.timestamp, blocks.prev_hash as prevHash
            FROM blocks
            WHERE blocks.height < :height
            ORDER BY blocks.height DESC
            LIMIT :limit
          ) as blocks
          LEFT JOIN transactions ON transactions.block_hash = blocks.hash
          GROUP BY blocks.hash
          ORDER BY blocks.height DESC`,
        {
          height: lastBlockHeight,
          limit
        }
      ]);
    } catch (error) {
      console.error("Blocks.getPreviousBlocks failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }
}
