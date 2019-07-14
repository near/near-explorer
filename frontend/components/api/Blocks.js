import { call } from "../../api";

const Blocks = {
  getBlocksInfo: async (maxHeight, count = 10) => {
    try {
      return await call(".select", [
        `SELECT blocks.hash, blocks.height, blocks.timestamp, blocks.author_id as authorId, COUNT(transactions.hash) as transactionsCount
          FROM blocks
          LEFT JOIN transactions ON transactions.chunk_hash = chunks.hash
          WHERE blocks.height <= ${maxHeight} AND blocks.height > ${maxHeight -
          count}
          GROUP BY blocks.hash
          ORDER BY blocks.height DESC`
      ]);
    } catch (error) {
      console.error(
        "DataProvider.getBlocksInfo[] failed to fetch data due to:",
        error
      );
      throw error;
    }
  }
};

export default Blocks;
