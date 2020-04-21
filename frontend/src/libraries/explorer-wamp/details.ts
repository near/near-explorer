import { ExplorerApi } from ".";

export interface Details {
  accountsCount: number;
  ValidatorCount: number;
  onlineNodesCount: number;
  lastDayTxCount: number;
  lastBlockHeight: number;
  transactionsPerSecond?: number;
}

export default class DetailsApi extends ExplorerApi {
  async getDetails(): Promise<Details | undefined> {
    try {
      const blockTimestamp = await this.call("select", [
        `SELECT timestamp FROM blocks WHERE timestamp > ((strftime('%s','now') - 30) * 1000 ) ORDER BY timestamp DESC LIMIT 1`
      ]).then((it: any) => (it.length > 0 ? it[0].timestamp : null));
      const [detail, tps] = await Promise.all([
        this.call("select", [
          `
          SELECT
          online_nodes.onlineNodesCount,
          validator_nodes.ValidatorCount,
          total_accounts.accountsCount,
          last_block.lastBlockHeight,
          Daytransactions.lastDayTxCount
        FROM
          (SELECT COUNT(*) as onlineNodesCount FROM nodes WHERE last_seen > (strftime('%s','now') - 60) * 1000) as online_nodes,
          (SELECT COUNT(*) as ValidatorCount FROM nodes 
              WHERE last_seen > (strftime('%s','now') - 60) * 1000 AND is_validator = 1
          ) as validator_nodes,
          (SELECT height as lastBlockHeight FROM blocks ORDER BY height DESC LIMIT 1) as last_block,
          (SELECT COUNT(*) as accountsCount FROM accounts) as total_accounts,
          (SELECT COUNT(*) as lastDayTxCount FROM transactions
              WHERE block_timestamp > (strftime('%s','now') - 60 * 60 * 24) * 1000  ) as Daytransactions
          `
        ]).then((it: any) => it[0]),
        blockTimestamp !== null
          ? this.call("select", [
              `
          SELECT COUNT(*) as transactionsPer10Second FROM transactions
            WHERE block_timestamp > (:blockTimestamp - 10 * 1000) AND block_timestamp <= :blockTimestamp 
          `,
              {
                blockTimestamp
              }
            ]).then((it: any) => Math.ceil(it[0].transactionsPer10Second / 10))
          : undefined
      ]);
      return detail !== undefined
        ? ({
            ...detail,
            transactionsPerSecond: tps
          } as Details)
        : undefined;
    } catch (error) {
      console.error("Details.getDetails failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }
}
