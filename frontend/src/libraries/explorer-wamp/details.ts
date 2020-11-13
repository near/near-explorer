import { ExplorerApi } from ".";

export interface Details {
  accountsCount: number;
  validatorsCount: number;
  onlineNodesCount: number;
  totalTxCount: number;
  lastDayTxCount: number;
  latestBlockHeight: number;
}

export default class DetailsApi extends ExplorerApi {
  async getDetails(): Promise<Details> {
    try {
      let [details, validatorsCount] = await Promise.all([
        this.call<[Details]>("select", [
          `
            SELECT
            online_nodes.onlineNodesCount,
            total_accounts.accountsCount,
            latest_block.latestBlockHeight,
            total_transactions.totalTxCount,
            day_transactions.lastDayTxCount
          FROM
            (SELECT COUNT(*) as onlineNodesCount FROM nodes WHERE last_seen > (strftime('%s','now') - 60) * 1000) as online_nodes,
            (SELECT height as latestBlockHeight FROM blocks ORDER BY height DESC LIMIT 1) as latest_block,
            (SELECT COUNT(*) as accountsCount FROM accounts) as total_accounts,
            (SELECT COUNT(*) as totalTxCount FROM transactions) as total_transactions,
            (SELECT COUNT(*) as lastDayTxCount FROM transactions
                WHERE block_timestamp > (strftime('%s','now') - 60 * 60 * 24) * 1000
            ) as day_transactions
          `,
        ]).then((it) => it[0]),
        this.getValidatorsCount(),
      ]);
      return { ...details, validatorsCount } as Details;
    } catch (error) {
      console.error("Details.getDetails failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getValidatorsCount(): Promise<any> {
    const validators = await this.call<any>("nearcore-validators");
    return validators.current_validators.length;
  }
}
