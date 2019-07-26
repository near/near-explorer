import { call } from "../../api";

const Blocks = {
  getTotal: async () => {
    try {
      const _ = await call(".select", [
        `SELECT COUNT(blocks.hash) AS total FROM blocks`
      ]);
      return _[0].total;
    } catch (error) {
      console.error("DataProvider.getTotal failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  },

  getLatestBlocksInfo: async (limit = 15) => {
    try {
      return await call(".select", [
        `SELECT blocks.hash, blocks.height, blocks.timestamp, blocks.author_id as authorId, blocks.prev_hash as prevHash, COUNT(transactions.hash) as transactionsCount
          FROM blocks
          LEFT JOIN chunks ON chunks.block_hash = blocks.hash
          LEFT JOIN transactions ON transactions.chunk_hash = chunks.hash
          GROUP BY blocks.hash
          ORDER BY blocks.height DESC
          LIMIT :limit`,
        {
          limit: limit
        }
      ]);
    } catch (error) {
      console.error(
        "DataProvider.getBlocksInfo[] failed to fetch data due to:"
      );
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
          hash: hash
        }
      ]);

      return block[0];
    } catch (error) {
      console.error("DataProvider.getBlockInfo failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  },

  getPreviousBlocks: async (lastBlockHeight, limit = 15) => {
    console.log(lastBlockHeight);
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
          limit: limit
        }
      ]);
    } catch (error) {
      console.error(
        "DataProvider.getPreviousBlocks failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
  }
};

export default Blocks;
