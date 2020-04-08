import { ExplorerApi } from ".";

export interface Details {
  accountsCount: number;
  totalNodesCount: number;
  onlineNodesCount: number;
  lastDayTxCount: number;
  lastBlockHeight: number;
  transactionsPerLast10Seconds: number;
}

export default class DetailsApi extends ExplorerApi {
  async getDetails(): Promise<Details> {
    try {
      const detail = await this.call("select", [
        `SELECT
          total_accounts.accountsCount,
          nodes.totalNodesCount,
          online_nodes.onlineNodesCount,
          transactions.lastDayTxCount,
          last_block.lastBlockHeight
        FROM
          (SELECT COUNT(*) as totalNodesCount FROM nodes) as nodes,
          (SELECT COUNT(*) as onlineNodesCount FROM nodes WHERE last_seen > (strftime('%s','now') - 60) * 1000) as online_nodes,
          (SELECT COUNT(*) as lastDayTxCount FROM transactions
              WHERE block_timestamp > (strftime('%s','now') - 60 * 60 * 24) * 1000
          ) as transactions,
          (SELECT height as lastBlockHeight FROM blocks ORDER BY height DESC LIMIT 1) as last_block,
          (SELECT COUNT(*) as accountsCount FROM accounts) as total_accounts`
      ]).then((it: any) => it[0]);
      const Tps = this.getTPS();
      return {
        ...detail,
        transactionsPerLast10Seconds: Tps
      };
    } catch (error) {
      console.error("Details.getDetails failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getTPS() {
    try {
      const blockTimestamp = await this.call("select", [
        `SELECT timestamp from blocks ORDER BY timestamp DESC LIMIT 1`
      ]).then((it: any) => it[0]);
      console.log(blockTimestamp);
      return await this.call("select", [
        `SELECT ((transactions_per_second.transactionsPerLast10Seconds + 9) / 10) as transactionsPerSecond
        FROM (SELECT COUNT(*) as transactionsPerLast10Seconds FROM transactions
        WHERE block_timestamp > (strftime('%s','now') - 10) * 1000) as transactions_per_second,
        `
      ]).then((it: any) => it[0]);
    } catch (error) {
      console.error("Details.getTPS failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }
}
