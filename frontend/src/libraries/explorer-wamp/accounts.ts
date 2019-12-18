import { ExplorerApi } from ".";

export interface AccountId {
  id: string;
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

export type Account = AccountId & AccountStats & AccountInfo;

export default class AccountApi extends ExplorerApi {
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
        ])
      ]);

      return {
        id,
        amount: accountInfo.amount,
        locked: accountInfo.locked,
        storageUsage: accountInfo.storage_usage,
        storagePaidAt: accountInfo.storage_paid_at,
        ...accountStats[0]
      };
    } catch (error) {
      console.error("AccountApi.getAccountInfo failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getAccounts(): Promise<AccountId[]> {
    try {
      return await this.call("select", [
        `SELECT DISTINCT receiver_id as id 
            from transactions 
            LEFT JOIN blocks ON blocks.hash = transactions.block_hash 
            ORDER by blocks.height DESC`
      ]);
    } catch (error) {
      console.error("AccountApi.getAccounts failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async queryAccount(id: string) {
    return this.call<any>("nearcore-query", [`account/${id}`, ""]);
  }
}
