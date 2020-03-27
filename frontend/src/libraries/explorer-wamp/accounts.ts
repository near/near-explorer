import { ExplorerApi } from ".";

export interface AccountBasicInfo {
  id: string;
  createdByTransactionHash?: string;
  createdAtBlockTimestamp?: number;
}

interface AccountStats {
  inTransactionsCount: number;
  outTransactionsCount: number;
}

interface AccountInfo {
  amount: string;
  locked: string;
  storageUsage: number;
  storagePaidAt: number;
}

export type Account = AccountBasicInfo & AccountStats & AccountInfo;

export default class AccountsApi extends ExplorerApi {
  async getAccountInfo(id: string): Promise<AccountStats & AccountInfo> {
    try {
      const [accountInfo, accountStats] = await Promise.all([
        this.queryAccount(id),
        this.call<AccountStats[]>("select", [
          `SELECT outTransactionsCount.outTransactionsCount, inTransactionsCount.inTransactionsCount FROM
            (SELECT COUNT(transactions.hash) as outTransactionsCount FROM transactions
              WHERE signer_id = :id) as outTransactionsCount,
            (SELECT COUNT(transactions.hash) as inTransactionsCount FROM transactions
              WHERE receiver_id = :id) as inTransactionsCount
          `,
          {
            id
          }
        ]).then(accounts => accounts[0])
      ]);
      return {
        amount: accountInfo.amount,
        locked: accountInfo.locked,
        storageUsage: accountInfo.storage_usage,
        storagePaidAt: accountInfo.storage_paid_at,
        ...accountStats
      };
    } catch (error) {
      console.error("AccountsApi.getAccountInfo failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getAccountBasic(id: string): Promise<AccountBasicInfo> {
    try {
      return await this.call<AccountBasicInfo[]>("select", [
        `SELECT account_id as id, created_at_block_timestamp as createdAtBlockTimestamp, created_by_transaction_hash as createdByTransactionHash
          FROM accounts
          WHERE account_id = :id
        `,
        {
          id
        }
      ]).then(accounts => accounts[0]);
    } catch (error) {
      console.error("AccountsApi.getAccountBasic failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getAccounts(
    limit: number = 15,
    endTimestamp?: number
  ): Promise<AccountBasicInfo[]> {
    try {
      return await this.call("select", [
        `SELECT account_id as id, timestamp, transaction_hash as address 
        FROM accounts
        ${endTimestamp ? `WHERE timestamp < :endTimestamp` : ""}
        ORDER BY timestamp DESC
        Limit :limit`,
        {
          limit,
          endTimestamp
        }
      ]);
    } catch (error) {
      console.error("AccountsApi.getAccounts failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async queryAccount(id: string): Promise<any> {
    return this.call<any>("nearcore-query", [`account/${id}`, ""]);
  }
}
