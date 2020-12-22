import { ExplorerApi } from ".";

export interface TransactionsByDate {
  date: string;
  transactions: number;
}

export interface TeragasUsedByDate {
  date: string;
  teragas: number;
}

export interface NewAccountsByDate {
  date: string;
  accounts: number;
}

export interface NewContractsByDate {
  date: string;
  contracts: number;
}

export default class StatsApi extends ExplorerApi {
  async transactionsByDate(): Promise<TransactionsByDate> {
    return await this.call<TransactionsByDate>("transactions-by-date");
  }

  async teragasUsedByDate(): Promise<TeragasUsedByDate> {
    return await this.call<TeragasUsedByDate>("teragas-used-by-date");
  }

  async newAccountsByDate(): Promise<NewAccountsByDate> {
    return await this.call<NewAccountsByDate>("new-accounts-by-date");
  }

  async newContractsByDate(): Promise<NewContractsByDate> {
    return await this.call<NewContractsByDate>("new-contracts-by-date");
  }
}
