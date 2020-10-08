import { sha256 } from "js-sha256";
import { ExplorerApi } from ".";

export interface AccountBasicInfo {
  id: string;
  createdByTransactionHash: string;
  createdAtBlockTimestamp: number;
  accountIndex: number;
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

export interface AccountPagination {
  endTimestamp: number;
  accountIndex: number;
}
const LOCKUP_ACCOUNT_ID_SUFFIX = "lockup.near";
export default class AccountsApi extends ExplorerApi {
  async getAccountInfo(id: string): Promise<Account> {
    try {
      const [accountInfo, accountStats, accountBasic] = await Promise.all([
        this.queryAccount(id),
        this.call<AccountStats[]>("select", [
          `SELECT outTransactionsCount.outTransactionsCount, inTransactionsCount.inTransactionsCount FROM
            (SELECT COUNT(transactions.hash) as outTransactionsCount FROM transactions
              WHERE signer_id = :id) as outTransactionsCount,
            (SELECT COUNT(transactions.hash) as inTransactionsCount FROM transactions
              WHERE receiver_id = :id) as inTransactionsCount
          `,
          {
            id,
          },
        ]).then((accounts) => accounts[0]),
        this.call<AccountBasicInfo[]>("select", [
          `SELECT account_id as id, created_at_block_timestamp as createdAtBlockTimestamp, created_by_transaction_hash as createdByTransactionHash
            FROM accounts
            WHERE account_id = :id
          `,
          {
            id,
          },
        ]).then((accounts) => accounts[0]),
      ]);
      return {
        amount: accountInfo.amount,
        locked: accountInfo.locked,
        storageUsage: accountInfo.storage_usage,
        storagePaidAt: accountInfo.storage_paid_at,
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
  ): Promise<AccountBasicInfo[]> {
    try {
      return await this.call("select", [
        `SELECT account_id as id, created_at_block_timestamp as createdAtBlockTimestamp, 
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

  async queryAccount(id: string): Promise<any> {
    return await this.call<any>("nearcore-view-account", [id]);
  }

  // copied from https://github.com/near/near-wallet/blob/f52a3b1a72b901d87ab2c9cee79770d697be2bd9/src/utils/wallet.js#L601
  async queryLockupAccountInfo(accountId: string) {
    const lockupAccountId =
      sha256(Buffer.from(accountId)).substring(0, 40) +
      "." +
      LOCKUP_ACCOUNT_ID_SUFFIX;
    const lockupAccount = await this.queryAccount(lockupAccountId);
    if (lockupAccount) {
      let lockupAmount = lockupAccount.amount;
      //need fix here
      let lockupTimestamp = 1601769600000; // hard code Oct 3 17:00
      return {
        lockupAccountId,
        lockupAmount,
        lockupTimestamp,
      };
    }
    return;
  }
}
