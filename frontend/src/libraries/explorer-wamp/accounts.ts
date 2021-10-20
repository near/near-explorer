import { ExplorerApi } from ".";

export interface AccountBasicInfo {
  accountId: string;
  createdByTransactionHash: string | null;
  createdAtBlockTimestamp: number | null;
  deletedByTransactionHash: string | null;
  deletedAtBlockTimestamp: number | null;
}

export interface AccountStats {
  inTransactionsCount: number;
  outTransactionsCount: number;
}

interface AccountInfo {
  stakedBalance: string;
  nonStakedBalance: string;
  storageUsage?: string;
  lockupAccountId?: string;
}

export type Account = AccountBasicInfo & AccountInfo;

export interface AccountPagination {
  endTimestamp?: number;
  accountIndex: number;
}

type PaginatedAccountBasicInfo = AccountBasicInfo & AccountPagination;

export default class AccountsApi extends ExplorerApi {
  async getAccountInfo(accountId: string): Promise<Account> {
    const queryBasicInfo = async () => {
      const accountsBasicInfo = await this.call<any>("select:INDEXER_BACKEND", [
        `SELECT
            inneraccounts.account_id,
            DIV(creation_receipt.included_in_block_timestamp, 1000*1000) AS created_at_block_timestamp,
            creation_receipt.originated_from_transaction_hash AS created_by_transaction_hash,
            DIV(deletion_receipt.included_in_block_timestamp, 1000*1000) AS deleted_at_block_timestamp,
            deletion_receipt.originated_from_transaction_hash AS deleted_by_transaction_hash
          FROM (
            SELECT account_id, created_by_receipt_id, deleted_by_receipt_id
                FROM accounts
                WHERE account_id = :account_id
          ) AS inneraccounts
          LEFT JOIN receipts AS creation_receipt ON creation_receipt.receipt_id = inneraccounts.created_by_receipt_id
          LEFT JOIN receipts AS deletion_receipt ON deletion_receipt.receipt_id = inneraccounts.deleted_by_receipt_id`,
        {
          account_id: accountId,
        },
      ]);

      if (accountsBasicInfo.length === 0) {
        throw {
          account_id: accountId,
          status: 404,
        };
      }
      const accountBasicInfo = accountsBasicInfo[0];
      return {
        accountId: accountBasicInfo.account_id,
        createdByTransactionHash: accountBasicInfo.created_by_transaction_hash,
        createdAtBlockTimestamp: parseInt(
          accountBasicInfo.created_at_block_timestamp
        ),
        deletedByTransactionHash:
          accountBasicInfo.deleted_by_transaction_hash || null,
        deletedAtBlockTimestamp: accountBasicInfo.deleted_at_block_timestamp
          ? parseInt(accountBasicInfo.deleted_at_block_timestamp)
          : null,
      };
    };

    const [accountInfo, accountBasic] = await Promise.all([
      this.queryAccount(accountId),
      queryBasicInfo(),
    ]);
    return {
      ...accountInfo,
      ...accountBasic,
    };
  }

  async queryAccountStats(accountId: string): Promise<AccountStats> {
    try {
      return await this.call<any>("select:INDEXER_BACKEND", [
        `SELECT out_transactions_count.out_transactions_count, in_transactions_count.in_transactions_count FROM
          (SELECT
              COUNT(transactions.transaction_hash) AS out_transactions_count
            FROM transactions
            WHERE signer_account_id = :account_id
          ) AS out_transactions_count,
          (SELECT
              COUNT(DISTINCT transactions.transaction_hash) AS in_transactions_count
            FROM transactions
            LEFT JOIN receipts ON receipts.originated_from_transaction_hash = transactions.transaction_hash
            WHERE
              receipts.receiver_account_id = :account_id
              AND
              transactions.signer_account_id != :account_id
          ) AS in_transactions_count`,
        {
          account_id: accountId,
        },
      ]).then((accounts) => {
        return {
          inTransactionsCount: accounts[0].in_transactions_count,
          outTransactionsCount: accounts[0].out_transactions_count,
        };
      });
    } catch (error) {
      console.error(
        "AccountsApi.queryAccountStats failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
  }

  async getAccounts(
    limit: number = 15,
    paginationIndexer?: AccountPagination
  ): Promise<PaginatedAccountBasicInfo[]> {
    try {
      let accounts = await this.call<any>("select:INDEXER_BACKEND", [
        `SELECT account_id AS account_id, id AS account_index, DIV(receipts.included_in_block_timestamp, 1000*1000) AS created_at_block_timestamp
          FROM accounts
          LEFT JOIN receipts ON receipts.receipt_id = accounts.created_by_receipt_id
          ${paginationIndexer ? `WHERE id < :account_index` : ""}
          ORDER BY account_index DESC
          LIMIT :limit`,
        {
          limit,
          account_index: paginationIndexer?.accountIndex,
        },
      ]);

      accounts = accounts.map((account: any) => {
        return {
          accountId: account.account_id,
          createdAtBlockTimestamp: parseInt(account.created_at_block_timestamp),
          accountIndex: account.account_index,
        };
      });
      return accounts as PaginatedAccountBasicInfo[];
    } catch (error) {
      console.error("AccountsApi.getAccounts failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async isAccountIndexed(accountId: string): Promise<boolean> {
    try {
      return await this.call<any>("select:INDEXER_BACKEND", [
        `SELECT
            account_id
          FROM accounts
          WHERE account_id = :accountId
          LIMIT 1`,
        {
          accountId,
        },
      ]).then((it) => Boolean(it[0]?.account_id));
    } catch (error) {
      console.error(
        "AccountsApi.isAccountIndexed failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
  }

  async queryAccount(accountId: string): Promise<any> {
    return await this.call<any>("get-account-details", [accountId]);
  }
}
