import {
  queryTransactionsCountAggregatedByDate,
  queryGasUsedAggregatedByDate,
  queryNewAccountsCountAggregatedByDate,
  queryDeletedAccountsCountAggregatedByDate,
  queryUniqueDeployedContractsCountAggregatedByDate,
  queryActiveAccountsCountAggregatedByDate,
  queryActiveAccountsCountAggregatedByWeek,
  queryNewContractsCountAggregatedByDate,
  queryActiveContractsCountAggregatedByDate,
  queryActiveContractsList,
  queryActiveAccountsList,
  queryDepositAmountAggregatedByDate,
  queryGenesisAccountCount,
  queryLatestCirculatingSupply,
  queryCirculatingSupply,
  calculateFeesByDay,
  queryFirstProducedBlockTimestamp,
} from "../database/queries";
import { formatDate } from "../utils/formatting";
import { trimError } from "../utils/logging";

type Nullable<T> = T | null;
type DatedStats<T> = (T & { date: string })[];

// term that store data from query
// transaction related
let TRANSACTIONS_COUNT_AGGREGATED_BY_DATE: Nullable<
  DatedStats<{ transactionsCount: string }>
> = null;
let GAS_USED_BY_DATE: Nullable<DatedStats<{ gasUsed: string }>> = null;
let DEPOSIT_AMOUNT_AGGREGATED_BY_DATE: Nullable<
  DatedStats<{ depositAmount: string }>
> = null;

// accounts
let NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE: Nullable<
  DatedStats<{ accountsCount: number }>
> = null;
let DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE: Nullable<
  DatedStats<{ accountsCount: number }>
> = null;
let ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_DATE: Nullable<
  DatedStats<{ accountsCount: number }>
> = null;
let ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_WEEK: Nullable<
  DatedStats<{ accountsCount: number }>
> = null;
let LIVE_ACCOUNTS_COUNT_AGGREGATE_BY_DATE: Nullable<
  DatedStats<{ accountsCount: number }>
> = null;
let ACTIVE_ACCOUNTS_LIST: Nullable<
  { account: string; transactionsCount: string }[]
> = null;
let ACCOUNTS_COUNT_IN_GENESIS: Nullable<string> = null;

// contracts
let NEW_CONTRACTS_COUNT_AGGREGATED_BY_DATE: Nullable<
  DatedStats<{ contractsCount: number }>
> = null;
let ACTIVE_CONTRACTS_COUNT_AGGREGATED_BY_DATE: Nullable<
  DatedStats<{ contractsCount: number }>
> = null;
let UNIQUE_DEPLOYED_CONTRACTS_COUNT_AGGREGATED_BY_DATE: Nullable<
  DatedStats<{ contractsCount: number }>
> = null;
let ACTIVE_CONTRACTS_LIST: Nullable<
  {
    contract: string;
    receiptsCount: string;
  }[]
> = null;

// circulating supply
let CIRCULATING_SUPPLY_BY_DATE: Nullable<
  DatedStats<{
    circulatingTokensSupply: string;
    totalTokensSupply: string;
  }>
> = null;

// This is a decorator that auto-retry failing function up to 5 times before giving up.
// If the wrapped function fails 5 times in a row, the result value is going to be undefined.
function retriable(
  wrapped: () => Promise<void>,
  action: string
): () => Promise<void> {
  return async function () {
    for (let attempts = 1; ; ++attempts) {
      try {
        await wrapped();
        return;
      } catch (error) {
        if (attempts >= 5) {
          console.warn(`ERROR: ${action} has failed after 5 attempts`);
          return;
        } else {
          console.warn(
            `WARNING: ${action} failed to execute ${attempts} times due to: ${trimError(
              error
            )}`
          );
        }
      }
    }
  };
}

// function that query from indexer
// transaction related
export const aggregateTransactionsCountByDate = retriable(async () => {
  const transactionsCountAggregatedByDate = await queryTransactionsCountAggregatedByDate();
  TRANSACTIONS_COUNT_AGGREGATED_BY_DATE = transactionsCountAggregatedByDate.map(
    ({ date, transactions_count_by_date }) => ({
      date: formatDate(date),
      transactionsCount: transactions_count_by_date,
    })
  );
}, "Transactions count time series");

export const aggregateGasUsedByDate = retriable(async () => {
  const gasUsedByDate = await queryGasUsedAggregatedByDate();
  GAS_USED_BY_DATE = gasUsedByDate.map(({ date, gas_used_by_date }) => ({
    date: formatDate(date),
    gasUsed: gas_used_by_date,
  }));
}, "Gas used time series");

export const aggregateDepositAmountByDate = retriable(async () => {
  const depositAmountByDate = await queryDepositAmountAggregatedByDate();
  DEPOSIT_AMOUNT_AGGREGATED_BY_DATE = depositAmountByDate.map(
    ({ date, total_deposit_amount }) => ({
      date: formatDate(date),
      depositAmount: total_deposit_amount,
    })
  );
}, "Deposit amount time series");

// accounts
export const aggregateNewAccountsCountByDate = retriable(async () => {
  const newAccountsCountAggregatedByDate = await queryNewAccountsCountAggregatedByDate();
  NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = newAccountsCountAggregatedByDate.map(
    ({ date, new_accounts_count_by_date }) => ({
      date: formatDate(date),
      accountsCount: new_accounts_count_by_date,
    })
  );
}, "New accounts count time series");

export const aggregateDeletedAccountsCountByDate = retriable(async () => {
  const deletedAccountsCountAggregatedByDate = await queryDeletedAccountsCountAggregatedByDate();
  DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = deletedAccountsCountAggregatedByDate.map(
    ({ date, deleted_accounts_count_by_date }) => ({
      date: formatDate(date),
      accountsCount: deleted_accounts_count_by_date,
    })
  );
}, "Deleted accounts count time series");

const generateDateArray = (
  startDate: string,
  endDate: Date = new Date()
): string[] => {
  for (
    var arr = [], dt = new Date(startDate);
    dt <= endDate;
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(formatDate(new Date(dt)));
  }
  return arr;
};

const cumulativeAccountsCountArray = <T extends { accountsCount: number }>(
  array: T[]
): T[] => {
  return array.reduce((r, a) => {
    if (r.length > 0) a.accountsCount += r[r.length - 1].accountsCount;
    r.push(a);
    return r;
  }, Array());
};

export const aggregateLiveAccountsCountByDate = retriable(async () => {
  const genesisCount = await queryGenesisAccountCount();
  ACCOUNTS_COUNT_IN_GENESIS = genesisCount.count;
  if (
    NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE &&
    DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE
  ) {
    const startDate = NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE[0].date;
    const dateArray = generateDateArray(startDate);
    let changedAccountsCountByDate = dateArray.map((date) => ({
      date: date,
      accountsCount: 0,
    }));
    changedAccountsCountByDate[0].accountsCount = Number(
      ACCOUNTS_COUNT_IN_GENESIS
    );

    let newAccountMap = new Map<string, number>();
    for (let i = 0; i < NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE.length; i++) {
      newAccountMap.set(
        NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE[i].date,
        Number(NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE[i].accountsCount)
      );
    }

    let deletedAccountMap = new Map<string, number>();
    for (let i = 0; i < DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE.length; i++) {
      deletedAccountMap.set(
        DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE[i].date,
        Number(DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE[i].accountsCount)
      );
    }

    for (let i = 0; i < changedAccountsCountByDate.length; i++) {
      const newAccountsCount = newAccountMap.get(
        changedAccountsCountByDate[i].date
      );
      if (newAccountsCount) {
        changedAccountsCountByDate[i].accountsCount += newAccountsCount;
      }
      const deletedAccountsCount = deletedAccountMap.get(
        changedAccountsCountByDate[i].date
      );
      if (deletedAccountsCount) {
        changedAccountsCountByDate[i].accountsCount -= deletedAccountsCount;
      }
    }
    LIVE_ACCOUNTS_COUNT_AGGREGATE_BY_DATE = cumulativeAccountsCountArray(
      changedAccountsCountByDate
    );
  }
}, "Live accounts count time series");

export const aggregateActiveAccountsCountByDate = retriable(async () => {
  const activeAccountsCountByDate = await queryActiveAccountsCountAggregatedByDate();
  ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = activeAccountsCountByDate.map(
    ({ date, active_accounts_count_by_date }) => ({
      date: formatDate(date),
      accountsCount: active_accounts_count_by_date,
    })
  );
}, "Top active accounts count time series");

export const aggregateActiveAccountsCountByWeek = retriable(async () => {
  const activeAccountsCountByWeek = await queryActiveAccountsCountAggregatedByWeek();
  ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_WEEK = activeAccountsCountByWeek.map(
    ({ date, active_accounts_count_by_week }) => ({
      date: formatDate(date),
      accountsCount: active_accounts_count_by_week,
    })
  );
}, "New accounts count time series weekly");

export const aggregateActiveAccountsList = retriable(async () => {
  const activeAccountsList = await queryActiveAccountsList();
  ACTIVE_ACCOUNTS_LIST = activeAccountsList
    .map(({ account_id: account, transactions_count: transactionsCount }) => ({
      account,
      transactionsCount: transactionsCount || "0",
    }))
    .reverse();
}, "Top active accounts with respective transactions count");

// contracts
export const aggregateNewContractsCountByDate = retriable(async () => {
  const newContractsByDate = await queryNewContractsCountAggregatedByDate();
  NEW_CONTRACTS_COUNT_AGGREGATED_BY_DATE = newContractsByDate.map(
    ({ date, new_contracts_count_by_date }) => ({
      date: formatDate(date),
      contractsCount: new_contracts_count_by_date,
    })
  );
}, "New contracts count time series");

export const aggregateActiveContractsCountByDate = retriable(async () => {
  const activeContractsCountByDate = await queryActiveContractsCountAggregatedByDate();
  ACTIVE_CONTRACTS_COUNT_AGGREGATED_BY_DATE = activeContractsCountByDate.map(
    ({ date, active_contracts_count_by_date }) => ({
      date: formatDate(date),
      contractsCount: active_contracts_count_by_date,
    })
  );
}, "Active contracts count time series");

export const aggregateUniqueDeployedContractsCountByDate = retriable(
  async () => {
    const uniqueContractsCountByDate = await queryUniqueDeployedContractsCountAggregatedByDate();
    UNIQUE_DEPLOYED_CONTRACTS_COUNT_AGGREGATED_BY_DATE = uniqueContractsCountByDate.map(
      ({ date, contracts_count_by_date }) => ({
        date: formatDate(date),
        contractsCount: contracts_count_by_date,
      })
    );
  },
  "Unique deployed contracts count time series"
);

export const aggregateActiveContractsList = retriable(async () => {
  const activeContractsList = await queryActiveContractsList();
  ACTIVE_CONTRACTS_LIST = activeContractsList
    .map(({ contract_id: contract, receipts_count: receiptsCount }) => ({
      contract,
      receiptsCount: receiptsCount || "0",
    }))
    .reverse();
}, "Top active contracts with respective receipts count");

export const aggregateCirculatingSupplyByDate = retriable(async () => {
  const queryCirculatingSupplyByDate = await queryCirculatingSupply();
  CIRCULATING_SUPPLY_BY_DATE = queryCirculatingSupplyByDate.map(
    ({ date, circulating_tokens_supply, total_tokens_supply }) => ({
      date: formatDate(date),
      circulatingTokensSupply: circulating_tokens_supply,
      totalTokensSupply: total_tokens_supply,
    })
  );
}, "Circulating supply & total supply time series");

// get function that exposed to frontend
// transaction related
export const getTransactionsByDate = () => {
  return TRANSACTIONS_COUNT_AGGREGATED_BY_DATE;
};

export const getGasUsedByDate = () => {
  return GAS_USED_BY_DATE;
};

export const getDepositAmountByDate = () => {
  return DEPOSIT_AMOUNT_AGGREGATED_BY_DATE;
};

//accounts
export const getNewAccountsCountByDate = () => {
  return NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE;
};

export const getDeletedAccountCountBydate = () => {
  return DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE;
};

export const getUniqueDeployedContractsCountByDate = () => {
  return UNIQUE_DEPLOYED_CONTRACTS_COUNT_AGGREGATED_BY_DATE;
};

export const getActiveAccountsCountByDate = () => {
  return ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_DATE;
};

export const getActiveAccountsCountByWeek = () => {
  return ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_WEEK;
};

export const getLiveAccountsCountByDate = () => {
  return LIVE_ACCOUNTS_COUNT_AGGREGATE_BY_DATE;
};

// blocks
export const getFirstProducedBlockTimestamp = async (): Promise<string> => {
  const {
    first_produced_block_timestamp: firstProducedBlockTimestamp,
  } = await queryFirstProducedBlockTimestamp();
  return formatDate(firstProducedBlockTimestamp);
};

export const getActiveAccountsList = () => {
  return ACTIVE_ACCOUNTS_LIST;
};

// contracts
export const getNewContractsCountByDate = () => {
  return NEW_CONTRACTS_COUNT_AGGREGATED_BY_DATE;
};

export const getActiveContractsCountByDate = () => {
  return ACTIVE_CONTRACTS_COUNT_AGGREGATED_BY_DATE;
};

export const getActiveContractsList = () => {
  return ACTIVE_CONTRACTS_LIST;
};

// circulating supply
export const getLatestCirculatingSupply = async (): Promise<{
  timestamp: string;
  circulating_supply_in_yoctonear: string;
}> => {
  const latestCirculatingSupply = await queryLatestCirculatingSupply();
  return {
    timestamp: latestCirculatingSupply.computed_at_block_timestamp,
    circulating_supply_in_yoctonear:
      latestCirculatingSupply.circulating_tokens_supply,
  };
};

export const getGenesisAccountsCount = () => {
  return ACCOUNTS_COUNT_IN_GENESIS;
};

export const getTotalFee = async (
  daysCount: number
): Promise<{ date: string; fee: string } | null> => {
  const feesByDay = await calculateFeesByDay(daysCount);
  if (!feesByDay) {
    return null;
  }
  return {
    date: formatDate(feesByDay.date),
    fee: feesByDay.fee || "0",
  };
};

export const getCirculatingSupplyByDate = () => {
  return CIRCULATING_SUPPLY_BY_DATE;
};
