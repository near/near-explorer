import { ExplorerApi } from ".";

export interface Details {
  accountsCount: number;
  totalNodesCount: number;
  onlineNodesCount: number;
  lastDayTxCount: number;
  lastBlockHeight: number;
  transactionsPerSecond: number | null;
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
      const Tps = await this.getTPS();
      return {
        ...detail,
        transactionsPerSecond: Tps
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
        `SELECT timestamp FROM blocks WHERE timestamp > ((strftime('%s','now') - 30) * 1000 ) ORDER BY timestamp DESC LIMIT 1`
      ]).then((it: any) => (it[0].timestamp !== null ? it[0].timestamp : null));
      if (blockTimestamp === null) {
        return null;
      }
      const TP10s = await this.call("select", [
        `SELECT COUNT(*) as transactionsPer10Second 
          FROM transactions
          WHERE block_timestamp > :blockTimestamp 
        `,
        {
          blockTimestamp: blockTimestamp - 10000
        }
      ]).then((it: any) => it[0].transactionsPer10Second);
      return Math.ceil(TP10s / 10);
    } catch (error) {
      console.error("Details.getTPS failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }
}
