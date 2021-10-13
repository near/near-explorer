const {
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
  queryPartnerUniqueUserAmount,
  queryGenesisAccountCount,
  queryLatestCirculatingSupply,
  queryCirculatingSupply,
  calculateFeesByDay,
  queryFirstProducedBlockTimestamp,
} = require("./db-utils");
const {
  formatDate,
  generateDateArray,
  cumulativeAccountsCountArray,
} = require("./utils");

// term that store data from query
// transaction related
let TRANSACTIONS_COUNT_AGGREGATED_BY_DATE = null;
let GAS_USED_BY_DATE = null;
let DEPOSIT_AMOUNT_AGGREGATED_BY_DATE = null;

// accounts
let NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = null;
let DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = null;
let ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = null;
let ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_WEEK = null;
let LIVE_ACCOUNTS_COUNT_AGGREGATE_BY_DATE = null;
let ACTIVE_ACCOUNTS_LIST = null;
let ACCOUNTS_COUNT_IN_GENESIS = null;

// contracts
let NEW_CONTRACTS_COUNT_AGGREGATED_BY_DATE = null;
let ACTIVE_CONTRACTS_COUNT_AGGREGATED_BY_DATE = null;
let UNIQUE_DEPLOYED_CONTRACTS_COUNT_AGGREGATED_BY_DATE = null;
let ACTIVE_CONTRACTS_LIST = null;

// partner
let PARTNER_TOTAL_TRANSACTIONS_COUNT = null;
let PARTNER_FIRST_3_MONTH_TRANSACTIONS_COUNT = null;
let PARTNER_UNIQUE_USER_AMOUNT = null;

// circulating supply
let CIRCULATING_SUPPLY_BY_DATE = null;

// This is a decorator that auto-retry failing function up to 5 times before giving up.
// If the wrapped function fails 5 times in a row, the result value is going to be undefined.
function retriable(wrapped) {
  return async function () {
    const functionName = wrapped.name;
    let result;
    for (let attempts = 1; ; ++attempts) {
      console.log(`${functionName} is getting executed...`);
      try {
        result = await wrapped.apply(this, arguments);
        break;
      } catch (error) {
        console.log(
          `WARNING: ${functionName} failed to execute ${attempts} times due to:`,
          error
        );
        if (attempts >= 5) {
          return;
        }
      }
    }
    console.log(`${functionName} has succeeded`);
    return result;
  };
}

// function that query from indexer
// transaction related
async function aggregateTransactionsCountByDate() {
  const transactionsCountAggregatedByDate = await queryTransactionsCountAggregatedByDate();
  TRANSACTIONS_COUNT_AGGREGATED_BY_DATE = transactionsCountAggregatedByDate.map(
    ({ date: dateString, transactions_count_by_date }) => ({
      date: formatDate(new Date(dateString)),
      transactionsCount: transactions_count_by_date,
    })
  );
}
aggregateTransactionsCountByDate = retriable(aggregateTransactionsCountByDate);

async function aggregateGasUsedByDate() {
  const gasUsedByDate = await queryGasUsedAggregatedByDate();
  GAS_USED_BY_DATE = gasUsedByDate.map(
    ({ date: dateString, gas_used_by_date }) => ({
      date: formatDate(new Date(dateString)),
      gasUsed: gas_used_by_date,
    })
  );
}
aggregateGasUsedByDate = retriable(aggregateGasUsedByDate);

async function aggregateDepositAmountByDate() {
  const depositAmountByDate = await queryDepositAmountAggregatedByDate();
  DEPOSIT_AMOUNT_AGGREGATED_BY_DATE = depositAmountByDate.map(
    ({ date: dateString, total_deposit_amount }) => ({
      date: formatDate(new Date(dateString)),
      depositAmount: total_deposit_amount,
    })
  );
}
aggregateDepositAmountByDate = retriable(aggregateDepositAmountByDate);

// accounts
async function aggregateNewAccountsCountByDate() {
  const newAccountsCountAggregatedByDate = await queryNewAccountsCountAggregatedByDate();
  NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = newAccountsCountAggregatedByDate.map(
    ({ date: dateString, new_accounts_count_by_date }) => ({
      date: formatDate(new Date(dateString)),
      accountsCount: new_accounts_count_by_date,
    })
  );
}
aggregateNewAccountsCountByDate = retriable(aggregateNewAccountsCountByDate);

async function aggregateDeletedAccountsCountByDate() {
  const deletedAccountsCountAggregatedByDate = await queryDeletedAccountsCountAggregatedByDate();
  DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = deletedAccountsCountAggregatedByDate.map(
    ({ date: dateString, deleted_accounts_count_by_date }) => ({
      date: formatDate(new Date(dateString)),
      accountsCount: deleted_accounts_count_by_date,
    })
  );
}
aggregateDeletedAccountsCountByDate = retriable(
  aggregateDeletedAccountsCountByDate
);

async function aggregateLiveAccountsCountByDate() {
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

    let newAccountMap = new Map();
    for (let i = 0; i < NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE.length; i++) {
      newAccountMap.set(
        NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE[i].date,
        Number(NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE[i].accountsCount)
      );
    }

    let deletedAccountMap = new Map();
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
}
aggregateLiveAccountsCountByDate = retriable(aggregateLiveAccountsCountByDate);

async function aggregateActiveAccountsCountByDate() {
  const activeAccountsCountByDate = await queryActiveAccountsCountAggregatedByDate();
  ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = activeAccountsCountByDate.map(
    ({ date: dateString, active_accounts_count_by_date }) => ({
      date: formatDate(new Date(dateString)),
      accountsCount: active_accounts_count_by_date,
    })
  );
}
aggregateActiveAccountsCountByDate = retriable(
  aggregateActiveAccountsCountByDate
);

async function aggregateActiveAccountsCountByWeek() {
  const activeAccountsCountByWeek = await queryActiveAccountsCountAggregatedByWeek();
  ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_WEEK = activeAccountsCountByWeek.map(
    ({ date: dateString, active_accounts_count_by_week }) => ({
      date: formatDate(new Date(dateString)),
      accountsCount: active_accounts_count_by_week,
    })
  );
}
aggregateActiveAccountsCountByWeek = retriable(
  aggregateActiveAccountsCountByWeek
);

async function aggregateActiveAccountsList() {
  const activeAccountsList = await queryActiveAccountsList();
  ACTIVE_ACCOUNTS_LIST = activeAccountsList.map(
    ({ account_id: account, transactions_count: transactionsCount }) => ({
      account,
      transactionsCount,
    })
  );
}
aggregateActiveAccountsList = retriable(aggregateActiveAccountsList);

// contracts
async function aggregateNewContractsCountByDate() {
  const newContractsByDate = await queryNewContractsCountAggregatedByDate();
  NEW_CONTRACTS_COUNT_AGGREGATED_BY_DATE = newContractsByDate.map(
    ({ date: dateString, new_contracts_count_by_date }) => ({
      date: formatDate(new Date(dateString)),
      contractsCount: new_contracts_count_by_date,
    })
  );
}
aggregateNewContractsCountByDate = retriable(aggregateNewContractsCountByDate);

async function aggregateActiveContractsCountByDate() {
  const activeContractsCountByDate = await queryActiveContractsCountAggregatedByDate();
  ACTIVE_CONTRACTS_COUNT_AGGREGATED_BY_DATE = activeContractsCountByDate.map(
    ({ date: dateString, active_contracts_count_by_date }) => ({
      date: formatDate(new Date(dateString)),
      contractsCount: active_contracts_count_by_date,
    })
  );
}
aggregateActiveContractsCountByDate = retriable(
  aggregateActiveContractsCountByDate
);

async function aggregateUniqueDeployedContractsCountByDate() {
  const uniqueContractsCountByDate = await queryUniqueDeployedContractsCountAggregatedByDate();
  UNIQUE_DEPLOYED_CONTRACTS_COUNT_AGGREGATED_BY_DATE = uniqueContractsCountByDate.map(
    ({ date: dateString, contracts_count_by_date }) => ({
      date: formatDate(new Date(dateString)),
      contractsCount: contracts_count_by_date,
    })
  );
}
aggregateUniqueDeployedContractsCountByDate = retriable(
  aggregateUniqueDeployedContractsCountByDate
);

async function aggregateActiveContractsList() {
  const activeContractsList = await queryActiveContractsList();
  ACTIVE_CONTRACTS_LIST = activeContractsList.map(
    ({ contract_id: contract, receipts_count: receiptsCount }) => ({
      contract,
      receiptsCount,
    })
  );
}
aggregateActiveContractsList = retriable(aggregateActiveContractsList);

// partner part
async function aggregatePartnerTotalTransactionsCount() {
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
}
aggregatePartnerTotalTransactionsCount = retriable(
  aggregatePartnerTotalTransactionsCount
);

async function aggregatePartnerFirst3MonthTransactionsCount() {
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
}
aggregatePartnerFirst3MonthTransactionsCount = retriable(
  aggregatePartnerFirst3MonthTransactionsCount
);

async function aggregateParterUniqueUserAmount() {
  const partnerUniqueUserAmount = await queryPartnerUniqueUserAmount();
  PARTNER_UNIQUE_USER_AMOUNT = partnerUniqueUserAmount.map(
    ({ receiver_account_id: account, user_amount: userAmount }) => ({
      account,
      userAmount,
    })
  );
}
aggregateParterUniqueUserAmount = retriable(aggregateParterUniqueUserAmount);

async function aggregateCirculatingSupplyByDate() {
  const queryCirculatingSupplyByDate = await queryCirculatingSupply();
  CIRCULATING_SUPPLY_BY_DATE = queryCirculatingSupplyByDate.map(
    ({ date, circulating_tokens_supply, total_tokens_supply }) => ({
      date: formatDate(new Date(date)),
      circulatingTokensSupply: circulating_tokens_supply,
      totalTokensSupply: total_tokens_supply,
    })
  );
}

aggregateCirculatingSupplyByDate = retriable(aggregateCirculatingSupplyByDate);

// get function that exposed to frontend
// transaction related
async function getTransactionsByDate() {
  return TRANSACTIONS_COUNT_AGGREGATED_BY_DATE;
}

async function getGasUsedByDate() {
  return GAS_USED_BY_DATE;
}

async function getDepositAmountByDate() {
  return DEPOSIT_AMOUNT_AGGREGATED_BY_DATE;
}

//accounts
async function getNewAccountsCountByDate() {
  return NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE;
}

async function getDeletedAccountCountBydate() {
  return DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE;
}

async function getUniqueDeployedContractsCountByDate() {
  return UNIQUE_DEPLOYED_CONTRACTS_COUNT_AGGREGATED_BY_DATE;
}

async function getActiveAccountsCountByDate() {
  return ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_DATE;
}

async function getActiveAccountsCountByWeek() {
  return ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_WEEK;
}

async function getLiveAccountsCountByDate() {
  return LIVE_ACCOUNTS_COUNT_AGGREGATE_BY_DATE;
}

// blocks
async function getFirstProducedBlockTimestamp() {
  const {
    first_produced_block_timestamp: firstProducedBlockTimestamp,
  } = await queryFirstProducedBlockTimestamp();
  return firstProducedBlockTimestamp;
}

async function getActiveAccountsList() {
  return ACTIVE_ACCOUNTS_LIST;
}

// contracts
async function getNewContractsCountByDate() {
  return NEW_CONTRACTS_COUNT_AGGREGATED_BY_DATE;
}

async function getActiveContractsCountByDate() {
  return ACTIVE_CONTRACTS_COUNT_AGGREGATED_BY_DATE;
}

async function getActiveContractsList() {
  return ACTIVE_CONTRACTS_LIST;
}

// partner part
async function getPartnerTotalTransactionsCount() {
  return PARTNER_TOTAL_TRANSACTIONS_COUNT;
}

async function getPartnerFirst3MonthTransactionsCount() {
  return PARTNER_FIRST_3_MONTH_TRANSACTIONS_COUNT;
}

async function getPartnerUniqueUserAmount() {
  return PARTNER_UNIQUE_USER_AMOUNT;
}

// circulating supply
async function getLatestCirculatingSupply() {
  const latestCirculatingSupply = await queryLatestCirculatingSupply();
  return {
    timestamp: latestCirculatingSupply.computed_at_block_timestamp,
    circulating_supply_in_yoctonear:
      latestCirculatingSupply.circulating_tokens_supply,
  };
}

async function getGenesisAccountsCount() {
  return ACCOUNTS_COUNT_IN_GENESIS;
}

async function getTotalFee(daysCount) {
  return await calculateFeesByDay(daysCount);
}

async function getCirculatingSupplyByDate() {
  return CIRCULATING_SUPPLY_BY_DATE;
}

// aggregate part
// transaction related
exports.aggregateTransactionsCountByDate = aggregateTransactionsCountByDate;
exports.aggregateGasUsedByDate = aggregateGasUsedByDate;
exports.aggregateDepositAmountByDate = aggregateDepositAmountByDate;

// accounts
exports.aggregateNewAccountsCountByDate = aggregateNewAccountsCountByDate;
exports.aggregateDeletedAccountsCountByDate = aggregateDeletedAccountsCountByDate;
exports.aggregateLiveAccountsCountByDate = aggregateLiveAccountsCountByDate;
exports.aggregateActiveAccountsCountByDate = aggregateActiveAccountsCountByDate;
exports.aggregateActiveAccountsCountByWeek = aggregateActiveAccountsCountByWeek;
exports.aggregateActiveAccountsList = aggregateActiveAccountsList;

// blocks
exports.getFirstProducedBlockTimestamp = getFirstProducedBlockTimestamp;

// contracts
exports.aggregateNewContractsCountByDate = aggregateNewContractsCountByDate;
exports.aggregateActiveContractsCountByDate = aggregateActiveContractsCountByDate;
exports.aggregateUniqueDeployedContractsCountByDate = aggregateUniqueDeployedContractsCountByDate;
exports.aggregateActiveContractsList = aggregateActiveContractsList;

// partner part
exports.aggregatePartnerTotalTransactionsCount = aggregatePartnerTotalTransactionsCount;
exports.aggregatePartnerFirst3MonthTransactionsCount = aggregatePartnerFirst3MonthTransactionsCount;
exports.aggregateParterUniqueUserAmount = aggregateParterUniqueUserAmount;

// circulating supply
exports.aggregateCirculatingSupplyByDate = aggregateCirculatingSupplyByDate;

// get method
// transaction related
exports.getTransactionsByDate = getTransactionsByDate;
exports.getGasUsedByDate = getGasUsedByDate;
exports.getDepositAmountByDate = getDepositAmountByDate;

// accounts
exports.getNewAccountsCountByDate = getNewAccountsCountByDate;
exports.getDeletedAccountCountBydate = getDeletedAccountCountBydate;
exports.getActiveAccountsCountByDate = getActiveAccountsCountByDate;
exports.getActiveAccountsCountByWeek = getActiveAccountsCountByWeek;
exports.getActiveAccountsList = getActiveAccountsList;
exports.getLiveAccountsCountByDate = getLiveAccountsCountByDate;

// contracts
exports.getNewContractsCountByDate = getNewContractsCountByDate;
exports.getUniqueDeployedContractsCountByDate = getUniqueDeployedContractsCountByDate;
exports.getActiveContractsCountByDate = getActiveContractsCountByDate;
exports.getActiveContractsList = getActiveContractsList;

// partner part
exports.getPartnerTotalTransactionsCount = getPartnerTotalTransactionsCount;
exports.getPartnerFirst3MonthTransactionsCount = getPartnerFirst3MonthTransactionsCount;
exports.getPartnerUniqueUserAmount = getPartnerUniqueUserAmount;

// circulating supply
exports.getLatestCirculatingSupply = getLatestCirculatingSupply;
exports.getCirculatingSupplyByDate = getCirculatingSupplyByDate;

exports.getGenesisAccountsCount = getGenesisAccountsCount;
exports.getTotalFee = getTotalFee;
