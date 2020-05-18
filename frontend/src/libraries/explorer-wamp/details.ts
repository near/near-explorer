import { ExplorerApi } from ".";

export interface Details {
  accountsCount: number;
  validatorsCount: number;
  onlineNodesCount: number;
  totalTxCount: number;
  lastDayTxCount: number;
  lastBlockHeight: number;
}

export default class DetailsApi extends ExplorerApi {
  async getDetails(): Promise<Details> {
    try {
      return await this.call<[Details]>("select", [
        `
          SELECT
          online_nodes.onlineNodesCount,
          validator_nodes.validatorsCount,
          total_accounts.accountsCount,
          last_block.lastBlockHeight,
          total_transactions.totalTxCount,
          day_transactions.lastDayTxCount
        FROM
          (SELECT COUNT(*) as onlineNodesCount FROM nodes WHERE last_seen > (strftime('%s','now') - 60) * 1000) as online_nodes,
          (SELECT COUNT(*) as validatorsCount FROM nodes 
              WHERE last_seen > (strftime('%s','now') - 60) * 1000 AND is_validator = 1
          ) as validator_nodes,
          (SELECT height as lastBlockHeight FROM blocks ORDER BY height DESC LIMIT 1) as last_block,
          (SELECT COUNT(*) as accountsCount FROM accounts) as total_accounts,
          (SELECT COUNT(*) as totalTxCount FROM transactions) as total_transactions,
          (SELECT COUNT(*) as lastDayTxCount FROM transactions
              WHERE block_timestamp > (strftime('%s','now') - 60 * 60 * 24) * 1000
          ) as day_transactions
        `,
      ]).then((it) => it[0]);
    } catch (error) {
      console.error("Details.getDetails failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }
}
