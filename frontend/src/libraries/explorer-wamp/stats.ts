import { ExplorerApi } from ".";

export interface TransactionsByDate {
  date: string;
  transactionsCount: number;
}

export interface TeragasUsedByDate {
  date: string;
  teragasUsed: number;
}

export interface AccountsByDate {
  date: string;
  accountsCount: number;
}

export interface ContractsByDate {
  date: string;
  contractsCount: number;
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

  async newAccountsCountAggregatedByDate(): Promise<AccountsByDate[]> {
    return await this.call<AccountsByDate[]>(
      "new-accounts-count-aggregated-by-date"
    );
  }

  async newContractsCountAggregatedByDate(): Promise<ContractsByDate[]> {
    return await this.call<ContractsByDate[]>(
      "new-contracts-count-aggregated-by-date"
    );
  }

  async activeContractsCountAggregatedByDate(): Promise<ContractsByDate[]> {
    return await this.call<ContractsByDate[]>(
      "active-contracts-count-aggregated-by-date"
    );
  }

  async activeAccountsCountAggregatedByDate(): Promise<AccountsByDate[]> {
    return await this.call<AccountsByDate[]>(
      "active-accounts-count-aggregated-by-date"
    );
  }
}
