import { call } from "../../api";

const Blocks = {
  getBlocksInfo: async (maxHeight, count = 10) => {
    try {
      return await call(".select", [
        `SELECT blocks.hash, blocks.height, blocks.timestamp, blocks.author_id as authorId, COUNT(transactions.hash) as transactionsCount
          FROM blocks
          LEFT JOIN chunks ON chunks.block_hash = blocks.hash
          LEFT JOIN transactions ON transactions.chunk_hash = chunks.hash
          WHERE blocks.height <= :maxHeight AND blocks.height > :minHeight
          GROUP BY blocks.hash
          ORDER BY blocks.height DESC`,
        {
          maxHeight: maxHeight,
          minHeight: maxHeight - count
        }
      ]);
    } catch (error) {
      console.error("DataProvider.getBlocksInfo[] failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }
};

export default Blocks;
