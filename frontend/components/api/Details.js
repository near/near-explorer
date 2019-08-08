import { call } from "../../api";

const Details = {
  getDetails: async () => {
    try {
      const details = await call(".select", [
        `SELECT
          accounts.accountsCount,
          nodes.totalNodesCount,
          online_nodes.onlineNodesCount,
          transactions.lastDayTxCount,
          last_block.lastBlockHeight,
          MAX(max_transactions_per_second.tx_per_second) as maxTransactionsPerSecond,
          ((transactions_per_second.tx_last_10_seconds + 9) / 10) as transactionsPerSecond
        FROM
          (SELECT COUNT(*) as accountsCount FROM accounts) as accounts,
          (SELECT COUNT(*) as totalNodesCount FROM nodes) as nodes,
          (SELECT COUNT(*) as onlineNodesCount FROM nodes WHERE last_seen > (strftime('%s','now') - 60) * 1000) as online_nodes,
          (
            SELECT COUNT(*) as lastDayTxCount FROM transactions
              LEFT JOIN chunks ON chunks.hash = transactions.chunk_hash
              LEFT JOIN blocks ON blocks.hash = chunks.block_hash
              WHERE blocks.timestamp > (strftime('%s','now') - 60 * 60 * 24) * 1000
          ) as transactions,
          (SELECT COUNT(transactions.hash) as tx_per_second, (blocks.timestamp / 1000) as second FROM transactions
              LEFT JOIN chunks ON chunks.hash = transactions.chunk_hash
              LEFT JOIN blocks ON blocks.hash = chunks.block_hash
              GROUP BY second
          ) as max_transactions_per_second,
          (SELECT COUNT(transactions.hash) as tx_last_10_seconds FROM transactions
              LEFT JOIN chunks ON chunks.hash = transactions.chunk_hash
              LEFT JOIN blocks ON blocks.hash = chunks.block_hash
              WHERE blocks.timestamp > (strftime('%s','now') - 10) * 1000
          ) as transactions_per_second,
          (SELECT height as lastBlockHeight FROM blocks ORDER BY height DESC LIMIT 1) as last_block`
      ]);
      return details[0];
    } catch (error) {
      console.error("Details.getDetails failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }
};

export default Details;
