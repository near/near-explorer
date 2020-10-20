import { ExplorerApi } from ".";

export interface AccountBasicInfo {
  accountId: string;
  createdByTransactionHash?: string;
  createdAtBlockTimestamp?: number;
}

interface AccountStats {
  inTransactionsCount: number;
  outTransactionsCount: number;
}

interface AccountInfo {
  stakedBalance: string;
  nonStakedBalance: string;
  minimumBalance: string;
  availableBalance: string;
  totalBalance: string;
  storageUsage: string;
  lockupAccountId?: string;
  lockupTotalBalance?: string;
  lockupUnlockedBalance?: string;
}

export type Account = AccountBasicInfo & AccountStats & AccountInfo;

export interface AccountPagination {
  endTimestamp: number;
  accountIndex: number;
}

type PaginatedAccountBasicInfo = AccountBasicInfo & { accountIndex: number };

export default class AccountsApi extends ExplorerApi {
  async getAccountInfo(accountId: string): Promise<Account> {
    try {
      const [accountInfo, accountBasic, accountStats] = await Promise.all([
        this.queryAccount(accountId),
        this.call<AccountBasicInfo[]>("select", [
          `SELECT account_id as accountId, created_at_block_timestamp as createdAtBlockTimestamp, created_by_transaction_hash as createdByTransactionHash
            FROM accounts
            WHERE account_id = :accountId
          `,
          {
            accountId,
          },
        ]).then((accounts) => {
          if (accounts.length === 0) {
            return {
              accountId,
            } as AccountBasicInfo;
          }
          return accounts[0];
        }),
        this.call<AccountStats[]>("select", [
          `SELECT outTransactionsCount.outTransactionsCount, inTransactionsCount.inTransactionsCount FROM
            (SELECT COUNT(transactions.hash) as outTransactionsCount FROM transactions
              WHERE signer_id = :accountId) as outTransactionsCount,
            (SELECT COUNT(transactions.hash) as inTransactionsCount FROM transactions
              WHERE receiver_id = :accountId) as inTransactionsCount
          `,
          {
            accountId,
          },
        ]).then((accounts) => accounts[0]),
      ]);
      return {
        ...accountInfo,
        ...accountBasic,
        ...accountStats,
      };
    } catch (error) {
      console.error("AccountsApi.getAccountInfo failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getAccounts(
    limit: number = 15,
    paginationIndexer?: AccountPagination
  ): Promise<PaginatedAccountBasicInfo[]> {
    try {
      return await this.call("select", [
        `SELECT account_id as accountId, created_at_block_timestamp as createdAtBlockTimestamp, 
          created_by_transaction_hash as createdByTransactionHash, account_index as accountIndex
          FROM accounts
          ${
            paginationIndexer
              ? `WHERE created_at_block_timestamp < :endTimestamp OR (created_at_block_timestamp = :endTimestamp AND account_index < :accountIndex)`
              : ""
          }
          ORDER BY created_at_block_timestamp DESC, account_index DESC
          LIMIT :limit`,
        {
          limit,
          ...paginationIndexer,
        },
      ]);
    } catch (error) {
      console.error("AccountsApi.getAccounts failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async queryAccount(accountId: string): Promise<any> {
    return await this.call<any>("get-account-details", [accountId]);
  }
}
