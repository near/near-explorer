import { ExplorerApi } from ".";

export interface AccountBasicInfo {
  accountId: string;
  createdByTransactionHash: string | null;
  createdAtBlockTimestamp: number | null;
  deletedByTransactionHash: string | null;
  deletedAtBlockTimestamp: number | null;
}

export interface AccountTransactionsCount {
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
    try {
      const isAccountExist = await this.isAccountIndexed(accountId);

      if (!isAccountExist) {
        throw new Error("account not found");
      }

      const [accountBasic, accountInfo] = await Promise.all([
        this.getAccountBaseInfo(accountId),
        this.getAccountDetails(accountId),
      ]);
      return {
        ...accountBasic,
        ...accountInfo,
      };
    } catch (error) {
      console.error("AccountsApi.getAccountInfo failed to fetch data due to:");
      console.error(error);
      throw error;
    }
  }

  async getAccountTransactionsCount(
    accountId: string
  ): Promise<AccountTransactionsCount> {
    return await this.call<AccountTransactionsCount>(
      "account-transactions-count",
      [accountId]
    );
  }

  async getAccounts(
    limit: number = 15,
    paginationIndexer?: AccountPagination
  ): Promise<PaginatedAccountBasicInfo[]> {
    return await this.call<PaginatedAccountBasicInfo[]>("accounts-list", [
      limit,
      paginationIndexer,
    ]);
  }

  async isAccountIndexed(accountId: string): Promise<boolean> {
    return await this.call<boolean>("is-account-indexed", [accountId]);
  }

  async getAccountBaseInfo(accountId: string): Promise<AccountBasicInfo> {
    return await this.call<AccountBasicInfo>("account-info", [accountId]);
  }

  async getAccountDetails(accountId: string): Promise<any> {
    return await this.call<any>("get-account-details", [accountId]);
  }
}
