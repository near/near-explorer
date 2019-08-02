import { call } from "../../api";

const Blocks = {
  searchBlocks: async (keyword, height = -1, limit = 15) => {
    try {
      return await call(".select", [
        `SELECT blocks_subquery.*, COUNT(transactions.hash) as transactionsCount FROM (
            SELECT blocks.hash, blocks.height, blocks.timestamp, blocks.author_id as authorId, blocks.prev_hash as prevHash FROM blocks
              ORDER BY blocks.height DESC LIMIT 15
          ) as blocks_subquery
          LEFT JOIN chunks ON chunks.block_hash = blocks_subquery.hash
          LEFT JOIN transactions ON transactions.chunk_hash = chunks.hash
          WHERE blocks.height LIKE :keyword AND blocks.height < :height
          GROUP BY blocks_subquery.hash
          ORDER BY blocks_subquery.height DESC`,
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
        `SELECT blocks_subquery.*, COUNT(transactions.hash) as transactionsCount FROM (
            SELECT blocks.hash, blocks.height, blocks.timestamp, blocks.author_id as authorId, blocks.prev_hash as prevHash FROM blocks
              ORDER BY blocks.height DESC LIMIT 15
          ) as blocks_subquery
          LEFT JOIN chunks ON chunks.block_hash = blocks_subquery.hash
          LEFT JOIN transactions ON transactions.chunk_hash = chunks.hash
          GROUP BY blocks_subquery.hash
          ORDER BY blocks_subquery.height DESC`,
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
        `SELECT blocks.hash, blocks.height, blocks.timestamp, blocks.author_id as authorId, blocks.prev_hash as prevHash, COUNT(transactions.hash) as transactionsCount
          FROM blocks
          LEFT JOIN chunks ON chunks.block_hash = blocks.hash
          LEFT JOIN transactions ON transactions.chunk_hash = chunks.hash
          WHERE blocks.hash = :hash`,
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
        `SELECT blocks.hash, blocks.height, blocks.timestamp, blocks.author_id as authorId, blocks.prev_hash as prevHash, COUNT(transactions.hash) as transactionsCount
          FROM blocks
          LEFT JOIN chunks ON chunks.block_hash = blocks.hash
          LEFT JOIN transactions ON transactions.chunk_hash = chunks.hash
          WHERE blocks.height < :height
          GROUP BY blocks.hash
          ORDER BY blocks.height DESC
          LIMIT :limit`,
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
