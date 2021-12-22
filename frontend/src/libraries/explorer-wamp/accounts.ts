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

export type PaginatedAccountBasicInfo = AccountBasicInfo & AccountPagination;

export default class AccountsApi extends ExplorerApi {
  async getAccountInfo(accountId: string): Promise<Account> {
    try {
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
    let isAccountExist;
    try {
      isAccountExist = await this.call<boolean>("is-account-indexed", [
        accountId,
      ]);
    } catch (error) {
      console.error(
        "AccountsApi.isAccountIndexed failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
    if (!isAccountExist) {
      throw new Error(`
        AccountsApi.isAccountIndexed: account '${accountId}' not found`);
    }
    return isAccountExist;
  }

  async getAccountBaseInfo(accountId: string): Promise<AccountBasicInfo> {
    let accountInfo;
    try {
      accountInfo = await this.call<AccountBasicInfo>("account-info", [
        accountId,
      ]);
    } catch (error) {
      console.error(
        "AccountsApi.getAccountBaseInfo failed to fetch data due to:"
      );
      console.error(error);
      throw error;
    }
    if (!accountInfo) {
      throw new Error(
        `AccountsApi.getAccountBaseInfo: info for '${accountId}' not found`
      );
    }
    return accountInfo;
  }

  async getAccountDetails(accountId: string): Promise<any> {
    return await this.call<any>("get-account-details", [accountId]);
  }
}
