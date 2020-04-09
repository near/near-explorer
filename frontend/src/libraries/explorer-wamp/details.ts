import { ExplorerApi } from ".";

export interface Details {
  accountsCount: number;
  totalNodesCount: number;
  onlineNodesCount: number;
  lastDayTxCount: number;
  lastBlockHeight: number;
  transactionsPer10Second: number;
  transactionsPerSecond: number | null;
}

export default class DetailsApi extends ExplorerApi {
  async getDetails(): Promise<Details> {
    try {
      const blockTimestamp = await this.call("select", [
        `SELECT timestamp FROM blocks WHERE timestamp > ((strftime('%s','now') - 30) * 1000 ) ORDER BY timestamp DESC LIMIT 1`
      ]).then((it: any) => (it[0].timestamp !== null ? it[0].timestamp : null));
      const details = await this.call<Details>("select", [
        `
        SELECT
          nodes.totalNodesCount,
          online_nodes.onlineNodesCount,
          total_accounts.accountsCount,
          last_block.lastBlockHeight,
          Daytransactions.lastDayTxCount,
          transactions.transactionsPer10Second
        FROM
          (SELECT COUNT(*) as totalNodesCount FROM nodes) as nodes,
          (SELECT COUNT(*) as onlineNodesCount FROM nodes WHERE last_seen > (strftime('%s','now') - 60) * 1000) as online_nodes,
          (SELECT height as lastBlockHeight FROM blocks ORDER BY height DESC LIMIT 1) as last_block,
          (SELECT COUNT(*) as accountsCount FROM accounts) as total_accounts,
          (SELECT COUNT(*) as lastDayTxCount FROM transactions
              WHERE block_timestamp > (:blockTimestamp - 60 * 60 * 24 * 1000)  ) as Daytransactions,
          (SELECT COUNT(*) as transactionsPer10Second FROM transactions
              WHERE block_timestamp > (:blockTimestamp - 10 * 1000)  ) as transactions
        `,
        {
          blockTimestamp:
            blockTimestamp !== null
              ? blockTimestamp
              : `strftime('%s','now') * 1000`
        }
      ]).then((it: any) => it[0]);
      return {
        ...details,
        transactionsPerSecond:
          blockTimestamp !== null
            ? Math.ceil(details.transactionsPer10Second / 10)
            : null
      };
    } catch (error) {
      console.error("Details.getDetails failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getTPS() {
    try {
    } catch (error) {
      console.error("Details.getTPS failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }
}
