import { ExplorerApi } from ".";

export interface TransactionsByDate {
  date: string;
  transactionsCount: number;
}

export interface TeragasUsedByDate {
  date: string;
  teragasUsed: number;
}

export interface NewAccountsByDate {
  date: string;
  accountsCount: number;
}

export interface NewContractsByDate {
  date: string;
  contractsCount: number;
}

export interface ActiveContractsCountByDate {
  date: string;
  contractsCount: number;
}

export interface ActiveAccountsCountByDate {
  date: string;
  accountsCount: number;
}

export default class StatsApi extends ExplorerApi {
  async transactionsCountAggregatedByDate(): Promise<TransactionsByDate[]> {
    return await this.call<TransactionsByDate[]>(
      "transactions-count-aggregated-by-date"
    );
  }

  async teragasUsedAggregatedByDate(): Promise<TeragasUsedByDate[]> {
    return await this.call<TeragasUsedByDate[]>(
      "teragas-used-aggregated-by-date"
    );
  }

  async newAccountsCountAggregatedByDate(): Promise<NewAccountsByDate[]> {
    return await this.call<NewAccountsByDate[]>(
      "new-accounts-count-aggregated-by-date"
    );
  }

  async newContractsCountAggregatedByDate(): Promise<NewContractsByDate[]> {
    return await this.call<NewContractsByDate[]>(
      "new-contracts-count-aggregated-by-date"
    );
  }

  async activeContractsCountAggregatedByDate(): Promise<
    ActiveContractsCountByDate[]
  > {
    return await this.call<ActiveContractsCountByDate[]>(
      "active-contracts-count-aggregated-by-date"
    );
  }

  async activeAccountsCountAggregatedByDate(): Promise<
    ActiveAccountsCountByDate[]
  > {
    return await this.call<ActiveAccountsCountByDate[]>(
      "active-accounts-count-aggregated-by-date"
    );
  }
}
