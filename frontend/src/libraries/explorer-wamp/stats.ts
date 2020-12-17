import { DATA_SOURCE_TYPE } from "../consts";
import { ExplorerApi } from ".";

import { AccountBasicInfo } from "./accounts";

export default class AccountsApi extends ExplorerApi {
  async newAccountsBydate(): Promise<AccountBasicInfo[]> {
    try {
      let accounts;
      if (this.dataSource === DATA_SOURCE_TYPE.LEGACY_SYNC_BACKEND) {
        accounts = await this.call<any>("select", [
          `SELECT account_id as account_id, created_at_block_timestamp, account_index
            FROM accounts
            ORDER BY created_at_block_timestamp DESC, account_index DESC
            LIMIT :limit`,
        ]);
      } else if (this.dataSource === DATA_SOURCE_TYPE.INDEXER_BACKEND) {
        accounts = await this.call<any>("select:INDEXER_BACKEND", [
          ``,
          {
            limit,
            account_index: paginationIndexer?.accountIndex,
          },
        ]);
      } else {
        throw Error(`unsupported data source ${this.dataSource}`);
      }

      accounts = accounts.map((account: any) => {
        return {
          accountId: account.account_id,
          createdAtBlockTimestamp: parseInt(account.created_at_block_timestamp),
          accountIndex: account.account_index,
        };
      });
      return accounts;
    } catch (error) {
      console.error("AccountsApi.getAccounts failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async transactionsByDate(): Promise<any> {
    //     SELECT
    //     TIMESTAMP 'epoch' + DIV(DIV(blocks.block_timestamp, 1000000000), 60 * 60 * 24) * INTERVAL '1 day' AS date,
    //     COUNT(*)
    // FROM transactions
    // JOIN blocks ON blocks.block_hash = transactions.included_in_block_hash
    // GROUP BY date
    // ORDER BY date
  }

  async newContractsByDate(): Promise<any> {
    //     SELECT
    //     TIMESTAMP 'epoch' + DIV(DIV(receipts.included_in_block_timestamp, 1000000000), 60 * 60 * 24) * INTERVAL '1 day' AS "date",
    //     COUNT(distinct receipts.receipt_id)
    // FROM action_receipt_actions
    // JOIN receipts ON receipts.receipt_id = action_receipt_actions.receipt_id
    // WHERE action_receipt_actions.action_kind = 'DEPLOY_CONTRACT'
    // GROUP BY "date"
    // ORDER BY "date"
  }
}
