import { ExplorerApi } from ".";

export default class DetailsApi extends ExplorerApi {
  async getDetails() {
    try {
      return await this.call("select", [
        `SELECT
          total_accounts.accountsCount,
          nodes.totalNodesCount,
          online_nodes.onlineNodesCount,
          transactions.lastDayTxCount,
          last_block.lastBlockHeight,
          ((transactions_per_second.transactionsPerLast10Seconds + 9) / 10) as transactionsPerSecond
        FROM
          (SELECT COUNT(*) as totalNodesCount FROM nodes) as nodes,
          (SELECT COUNT(*) as onlineNodesCount FROM nodes WHERE last_seen > (strftime('%s','now') - 60) * 1000) as online_nodes,
          (SELECT COUNT(*) as lastDayTxCount FROM transactions
              WHERE block_timestamp > (strftime('%s','now') - 60 * 60 * 24) * 1000
          ) as transactions,
          (SELECT COUNT(*) as transactionsPerLast10Seconds FROM transactions
              WHERE block_timestamp > (strftime('%s','now') - 10) * 1000
          ) as transactions_per_second,
          (SELECT height as lastBlockHeight FROM blocks ORDER BY height DESC LIMIT 1) as last_block,
          (SELECT COUNT(*) as accountsCount FROM accounts) as total_accounts`
      ]).then(it => it[0]);
    } catch (error) {
      console.error("Details.getDetails failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }
}
