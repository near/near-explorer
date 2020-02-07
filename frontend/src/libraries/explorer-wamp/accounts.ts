import { ExplorerApi } from ".";

export interface AccountBasicInfo {
  id: string;
  timestamp: number | string;
  address: string;
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
  async getAccountInfo(id: string): Promise<Account> {
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
        id,
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
      const accountBasic = await this.call<AccountBasicInfo[]>("select", [
        `SELECT account_id as id, timestamp, transaction_hash as address FROM accounts
          WHERE account_id = :id
        `,
        {
          id
        }
      ]).then(accounts => accounts[0]);
      return {
        id,
        timestamp: accountBasic.timestamp,
        address: accountBasic.address
      };
    } catch (error) {
      console.error("AccountsApi.getAccountBasic failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getAccounts(limit: number): Promise<AccountBasicInfo[]> {
    try {
      return await this.call("select", [
        `SELECT account_id as id, timestamp, transaction_hash as address 
        FROM accounts 
        ORDER BY timestamp DESC
        LIMIT :limit`,
        {
          limit
        }
      ]);
    } catch (error) {
      console.error("AccountsApi.getAccounts failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getAccountLength(): Promise<number> {
    try {
      return await this.call("select", [
        `SELECT COUNT(account_id) FROM accounts`
      ]);
    } catch (error) {
      console.error(
        "AccountsApi.getAccountLength failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
  }

  async queryAccount(id: string) {
    return this.call<any>("nearcore-query", [`account/${id}`, ""]);
  }
}
