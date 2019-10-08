import { call } from ".";

const Blocks = {
  searchBlocks: async (keyword, height = -1, limit = 15) => {
    try {
      return await call(".select", [
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
  },

  getTotal: async () => {
    try {
      const _ = await call(".select", [
        `SELECT COUNT(blocks.hash) AS total FROM blocks`
      ]);
      return _[0].total;
    } catch (error) {
      console.error("Blocks.getTotal failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  },

  getLatestBlocksInfo: async (limit = 15) => {
    try {
      return await call(".select", [
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
  },

  getBlockInfo: async hash => {
    try {
      const block = await call(".select", [
        `SELECT blocks.*, COUNT(transactions.hash) as transactionsCount
          FROM (
            SELECT blocks.hash, blocks.height, blocks.timestamp, blocks.prev_hash as prevHash
            FROM blocks
            WHERE blocks.hash = :hash
          ) as blocks
          LEFT JOIN transactions ON transactions.block_hash = blocks.hash`,
        {
          hash
        }
      ]);

      return block[0];
    } catch (error) {
      console.error("Blocks.getBlockInfo failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  },

  getPreviousBlocks: async (lastBlockHeight, limit = 15) => {
    try {
      return await call(".select", [
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
};

export default Blocks;
