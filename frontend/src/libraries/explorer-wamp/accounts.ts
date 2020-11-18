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

type PaginatedAccountBasicInfo = AccountBasicInfo & {
  accountIndex: number;
  isIndexer?: boolean;
};

export default class AccountsApi extends ExplorerApi {
  selectOption: string;
  constructor() {
    super();
    this.selectOption =
      this.nearNetwork.name === "testnet" ? "Indexer" : "Legacy";
  }

  async getAccountInfo(accountId: string): Promise<Account> {
    const queryBasicInfo = async () => {
      if (this.selectOption === "Legacy") {
        return await this.call<any>("select", [
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
        });
      }
      return await this.call<any>("select:INDEXER_BACKEND", [
        `	SELECT 	inneraccounts.account_id, receipts.included_in_block_timestamp, receipts.originated_from_transaction_hash 
        from (
          SELECT account_id, created_by_receipt_id
                  FROM accounts
                   WHERE account_id = :account_id
                 ) as inneraccounts
        left join receipts on receipts.receipt_id = inneraccounts.created_by_receipt_id`,
        {
          account_id: accountId,
        },
      ]).then((accounts) => {
        if (accounts.length === 0) {
          return {
            accountId,
          } as AccountBasicInfo;
        }
        return {
          accountId,
          createdByTransactionHash:
            accounts[0].originated_from_transaction_hash,
          createdAtBlockTimestamp: accounts[0].included_in_block_timestamp,
        };
      });
    };
    try {
      const [accountInfo, accountBasic, accountStats] = await Promise.all([
        this.queryAccount(accountId),
        queryBasicInfo,
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
      let accounts;
      if (this.selectOption === "Legacy") {
        accounts = await this.call<any>("select", [
          `SELECT account_id as account_id, created_at_block_timestamp, account_index as accountIndex
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
      } else {
        accounts = await this.call<any>("select:INDEXER_BACKEND", [
          `SELECT account_id as account_id, id as account_index
            FROM accounts
            ${paginationIndexer ? `WHERE id < :account_index` : ""}
            ORDER BY account_index DESC
            LIMIT :limit`,
          {
            limit,
            account_index: paginationIndexer?.accountIndex,
          },
        ]);
      }
      accounts = accounts.map((account: any) => {
        return {
          accountId: account.account_id,
          createdAtBlockTimestamp: account.created_at_block_timestamp
            ? account.created_at_block_timestamp
            : undefined,
          accountIndex: account.account_index,
          isIndexer: this.selectOption === "Indexer" ? true : undefined,
        };
      });
      return accounts as PaginatedAccountBasicInfo[];
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
