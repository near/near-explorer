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
  queryPartnerTotalTransactions,
  queryPartnerFirstThreeMonthTransactions,
  queryDepositAmountAggregatedByDate,
  queryGenesisAccountCount,
  queryLatestCirculatingSupply,
  queryCirculatingSupply,
  calculateFeesByDay,
  queryFirstProducedBlockTimestamp,
} from "./db-utils";
import {
  formatDate,
  generateDateArray,
  cumulativeAccountsCountArray,
  trimError,
} from "./utils";

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

// partner
let PARTNER_TOTAL_TRANSACTIONS_COUNT: Nullable<
  { account: string; transactionsCount: string }[]
> = null;
let PARTNER_FIRST_3_MONTH_TRANSACTIONS_COUNT: Nullable<
  { account: string; transactionsCount: string }[]
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
const aggregateTransactionsCountByDate = retriable(async () => {
  const transactionsCountAggregatedByDate = await queryTransactionsCountAggregatedByDate();
  TRANSACTIONS_COUNT_AGGREGATED_BY_DATE = transactionsCountAggregatedByDate.map(
    ({ date, transactions_count_by_date }) => ({
      date: formatDate(date),
      transactionsCount: transactions_count_by_date,
    })
  );
}, "Transactions count time series");

const aggregateGasUsedByDate = retriable(async () => {
  const gasUsedByDate = await queryGasUsedAggregatedByDate();
  GAS_USED_BY_DATE = gasUsedByDate.map(({ date, gas_used_by_date }) => ({
    date: formatDate(date),
    gasUsed: gas_used_by_date,
  }));
}, "Gas used time series");

const aggregateDepositAmountByDate = retriable(async () => {
  const depositAmountByDate = await queryDepositAmountAggregatedByDate();
  DEPOSIT_AMOUNT_AGGREGATED_BY_DATE = depositAmountByDate.map(
    ({ date, total_deposit_amount }) => ({
      date: formatDate(date),
      depositAmount: total_deposit_amount,
    })
  );
}, "Deposit amount time series");

// accounts
const aggregateNewAccountsCountByDate = retriable(async () => {
  const newAccountsCountAggregatedByDate = await queryNewAccountsCountAggregatedByDate();
  NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = newAccountsCountAggregatedByDate.map(
    ({ date, new_accounts_count_by_date }) => ({
      date: formatDate(date),
      accountsCount: new_accounts_count_by_date,
    })
  );
}, "New accounts count time series");

const aggregateDeletedAccountsCountByDate = retriable(async () => {
  const deletedAccountsCountAggregatedByDate = await queryDeletedAccountsCountAggregatedByDate();
  DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = deletedAccountsCountAggregatedByDate.map(
    ({ date, deleted_accounts_count_by_date }) => ({
      date: formatDate(date),
      accountsCount: deleted_accounts_count_by_date,
    })
  );
}, "Deleted accounts count time series");

const aggregateLiveAccountsCountByDate = retriable(async () => {
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

const aggregateActiveAccountsCountByDate = retriable(async () => {
  const activeAccountsCountByDate = await queryActiveAccountsCountAggregatedByDate();
  ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = activeAccountsCountByDate.map(
    ({ date, active_accounts_count_by_date }) => ({
      date: formatDate(date),
      accountsCount: active_accounts_count_by_date,
    })
  );
}, "Top active accounts count time series");

const aggregateActiveAccountsCountByWeek = retriable(async () => {
  const activeAccountsCountByWeek = await queryActiveAccountsCountAggregatedByWeek();
  ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_WEEK = activeAccountsCountByWeek.map(
    ({ date, active_accounts_count_by_week }) => ({
      date: formatDate(date),
      accountsCount: active_accounts_count_by_week,
    })
  );
}, "New accounts count time series weekly");

const aggregateActiveAccountsList = retriable(async () => {
  const activeAccountsList = await queryActiveAccountsList();
  ACTIVE_ACCOUNTS_LIST = activeAccountsList.map(
    ({ account_id: account, transactions_count: transactionsCount }) => ({
      account,
      transactionsCount,
    })
  );
}, "Top active accounts with respective transactions count");

// contracts
const aggregateNewContractsCountByDate = retriable(async () => {
  const newContractsByDate = await queryNewContractsCountAggregatedByDate();
  NEW_CONTRACTS_COUNT_AGGREGATED_BY_DATE = newContractsByDate.map(
    ({ date, new_contracts_count_by_date }) => ({
      date: formatDate(date),
      contractsCount: new_contracts_count_by_date,
    })
  );
}, "New contracts count time series");

const aggregateActiveContractsCountByDate = retriable(async () => {
  const activeContractsCountByDate = await queryActiveContractsCountAggregatedByDate();
  ACTIVE_CONTRACTS_COUNT_AGGREGATED_BY_DATE = activeContractsCountByDate.map(
    ({ date, active_contracts_count_by_date }) => ({
      date: formatDate(date),
      contractsCount: active_contracts_count_by_date,
    })
  );
}, "Active contracts count time series");

const aggregateUniqueDeployedContractsCountByDate = retriable(async () => {
  const uniqueContractsCountByDate = await queryUniqueDeployedContractsCountAggregatedByDate();
  UNIQUE_DEPLOYED_CONTRACTS_COUNT_AGGREGATED_BY_DATE = uniqueContractsCountByDate.map(
    ({ date, contracts_count_by_date }) => ({
      date: formatDate(date),
      contractsCount: contracts_count_by_date,
    })
  );
}, "Unique deployed contracts count time series");

const aggregateActiveContractsList = retriable(async () => {
  const activeContractsList = await queryActiveContractsList();
  ACTIVE_CONTRACTS_LIST = activeContractsList.map(
    ({ contract_id: contract, receipts_count: receiptsCount }) => ({
      contract,
      receiptsCount,
    })
  );
}, "Top active contracts with respective receipts count");

// partner part
const aggregatePartnerTotalTransactionsCount = retriable(async () => {
  const partnerTotalTransactionList = await queryPartnerTotalTransactions();
  PARTNER_TOTAL_TRANSACTIONS_COUNT = partnerTotalTransactionList.map(
    ({
      receiver_account_id: account,
      transactions_count: transactionsCount,
    }) => ({
      account,
      transactionsCount,
    })
  );
}, "Partners with respective transaction counts");

const aggregatePartnerFirst3MonthTransactionsCount = retriable(async () => {
  const partnerFirst3MonthTransactionsCount = await queryPartnerFirstThreeMonthTransactions();
  PARTNER_FIRST_3_MONTH_TRANSACTIONS_COUNT = partnerFirst3MonthTransactionsCount.map(
    ({
      receiver_account_id: account,
      transactions_count: transactionsCount,
    }) => ({
      account,
      transactionsCount,
    })
  );
}, "Partners with respective transaction counts - first 3 months");

const aggregateCirculatingSupplyByDate = retriable(async () => {
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
async function getTransactionsByDate(): Promise<
  typeof TRANSACTIONS_COUNT_AGGREGATED_BY_DATE
> {
  return TRANSACTIONS_COUNT_AGGREGATED_BY_DATE;
}

async function getGasUsedByDate(): Promise<typeof GAS_USED_BY_DATE> {
  return GAS_USED_BY_DATE;
}

async function getDepositAmountByDate(): Promise<
  typeof DEPOSIT_AMOUNT_AGGREGATED_BY_DATE
> {
  return DEPOSIT_AMOUNT_AGGREGATED_BY_DATE;
}

//accounts
async function getNewAccountsCountByDate(): Promise<
  typeof NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE
> {
  return NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE;
}

async function getDeletedAccountCountBydate(): Promise<
  typeof DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE
> {
  return DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE;
}

async function getUniqueDeployedContractsCountByDate(): Promise<
  typeof UNIQUE_DEPLOYED_CONTRACTS_COUNT_AGGREGATED_BY_DATE
> {
  return UNIQUE_DEPLOYED_CONTRACTS_COUNT_AGGREGATED_BY_DATE;
}

async function getActiveAccountsCountByDate(): Promise<
  typeof ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_DATE
> {
  return ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_DATE;
}

async function getActiveAccountsCountByWeek(): Promise<
  typeof ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_WEEK
> {
  return ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_WEEK;
}

async function getLiveAccountsCountByDate(): Promise<
  typeof LIVE_ACCOUNTS_COUNT_AGGREGATE_BY_DATE
> {
  return LIVE_ACCOUNTS_COUNT_AGGREGATE_BY_DATE;
}

// blocks
async function getFirstProducedBlockTimestamp(): Promise<string> {
  const {
    first_produced_block_timestamp: firstProducedBlockTimestamp,
  } = await queryFirstProducedBlockTimestamp();
  return formatDate(firstProducedBlockTimestamp);
}

async function getActiveAccountsList(): Promise<typeof ACTIVE_ACCOUNTS_LIST> {
  return ACTIVE_ACCOUNTS_LIST;
}

// contracts
async function getNewContractsCountByDate(): Promise<
  typeof NEW_CONTRACTS_COUNT_AGGREGATED_BY_DATE
> {
  return NEW_CONTRACTS_COUNT_AGGREGATED_BY_DATE;
}

async function getActiveContractsCountByDate(): Promise<
  typeof ACTIVE_CONTRACTS_COUNT_AGGREGATED_BY_DATE
> {
  return ACTIVE_CONTRACTS_COUNT_AGGREGATED_BY_DATE;
}

async function getActiveContractsList(): Promise<typeof ACTIVE_CONTRACTS_LIST> {
  return ACTIVE_CONTRACTS_LIST;
}

// partner part
async function getPartnerTotalTransactionsCount(): Promise<
  typeof PARTNER_TOTAL_TRANSACTIONS_COUNT
> {
  return PARTNER_TOTAL_TRANSACTIONS_COUNT;
}

async function getPartnerFirst3MonthTransactionsCount(): Promise<
  typeof PARTNER_FIRST_3_MONTH_TRANSACTIONS_COUNT
> {
  return PARTNER_FIRST_3_MONTH_TRANSACTIONS_COUNT;
}

// circulating supply
async function getLatestCirculatingSupply(): Promise<{
  timestamp: string;
  circulating_supply_in_yoctonear: string;
}> {
  const latestCirculatingSupply = await queryLatestCirculatingSupply();
  return {
    timestamp: latestCirculatingSupply.computed_at_block_timestamp,
    circulating_supply_in_yoctonear:
      latestCirculatingSupply.circulating_tokens_supply,
  };
}

async function getGenesisAccountsCount(): Promise<
  typeof ACCOUNTS_COUNT_IN_GENESIS
> {
  return ACCOUNTS_COUNT_IN_GENESIS;
}

async function getTotalFee(
  daysCount: number
): Promise<{ date: string; fee: string } | null> {
  const feesByDay = await calculateFeesByDay(daysCount);
  if (!feesByDay) {
    return null;
  }
  return {
    date: formatDate(feesByDay.date),
    fee: feesByDay.fee,
  };
}

async function getCirculatingSupplyByDate(): Promise<
  typeof CIRCULATING_SUPPLY_BY_DATE
> {
  return CIRCULATING_SUPPLY_BY_DATE;
}

// aggregate part
// transaction related
export {
  aggregateTransactionsCountByDate,
  aggregateGasUsedByDate,
  aggregateDepositAmountByDate,
};

// accounts
export {
  aggregateNewAccountsCountByDate,
  aggregateDeletedAccountsCountByDate,
  aggregateLiveAccountsCountByDate,
  aggregateActiveAccountsCountByDate,
  aggregateActiveAccountsCountByWeek,
  aggregateActiveAccountsList,
};

// blocks
export { getFirstProducedBlockTimestamp };

// contracts
export {
  aggregateNewContractsCountByDate,
  aggregateActiveContractsCountByDate,
  aggregateUniqueDeployedContractsCountByDate,
  aggregateActiveContractsList,
};

// partner part
export {
  aggregatePartnerTotalTransactionsCount,
  aggregatePartnerFirst3MonthTransactionsCount,
};

// circulating supply
export { aggregateCirculatingSupplyByDate };

// get method
// transaction related
export { getTransactionsByDate, getGasUsedByDate, getDepositAmountByDate };

// accounts
export {
  getNewAccountsCountByDate,
  getDeletedAccountCountBydate,
  getActiveAccountsCountByDate,
  getActiveAccountsCountByWeek,
  getActiveAccountsList,
  getLiveAccountsCountByDate,
};

// contracts
export {
  getNewContractsCountByDate,
  getUniqueDeployedContractsCountByDate,
  getActiveContractsCountByDate,
  getActiveContractsList,
};

// partner part
export {
  getPartnerTotalTransactionsCount,
  getPartnerFirst3MonthTransactionsCount,
};

// circulating supply
export {
  getLatestCirculatingSupply,
  getCirculatingSupplyByDate,
  getGenesisAccountsCount,
  getTotalFee,
};
