const {
  queryTransactionsCountAggregatedByDate,
  queryTeragasUsedAggregatedByDate,
  queryNewAccountsCountAggregatedByDate,
  queryDeletedAccountsAggregatedByDate,
  queryUniqueDeployedContractsAggregatedByDate,
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
} = require("./db-utils");
const {
  formatDate,
  generateDateArray,
  cumulativeSumArray,
} = require("./utils");

// term that store data from query
// transaction related
let TRANSACTIONS_COUNT_AGGREGATED_BY_DATE = null;
let TERAGAS_USED_BY_DATE = null;
let DEPOSIT_AMOUNT_AGGREGATED_BY_DATE = null;

// accounts
let NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = null;
let DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = null;
let ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = null;
let ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_WEEK = null;
let LIVE_ACCOUNTS_COUNT_AGGREGATE_BY_DATE = null;
let ACTIVE_ACCOUNTS_LIST = null;

// contracts
let NEW_CONTRACTS_COUNT_AGGREGATED_BY_DATE = null;
let ACTIVE_CONTRACTS_COUNT_AGGREGATED_BY_DATE = null;
let UNIQUE_DEPLOYED_CONTRACTS_COUNT_AGGREGATED_BY_DATE = null;
let ACTIVE_CONTRACTS_LIST = null;

// partner
let PARTNER_TOTAL_TRANSACTIONS_COUNT = null;
let PARTNER_FIRST_3_MONTH_TRANSACTIONS_COUNT = null;
let PARTNER_UNIQUE_USER_AMOUNT = null;

// function that query from indexer
// transaction related
async function aggregateTransactionsCountByDate() {
  try {
    const transactionsCountAggregatedByDate = await queryTransactionsCountAggregatedByDate();
    TRANSACTIONS_COUNT_AGGREGATED_BY_DATE = transactionsCountAggregatedByDate.map(
      ({ date: dateString, transactions_count_by_date }) => ({
        date: formatDate(new Date(dateString)),
        transactionsCount: transactions_count_by_date,
      })
    );
    console.log("TRANSACTIONS_COUNT_AGGREGATED_BY_DATE updated.");
  } catch (error) {
    console.log(error);
  }
}

async function aggregateTeragasUsedByDate() {
  try {
    const teragasUsedByDate = await queryTeragasUsedAggregatedByDate();
    TERAGAS_USED_BY_DATE = teragasUsedByDate.map(
      ({ date: dateString, teragas_used_by_date }) => ({
        date: formatDate(new Date(dateString)),
        teragasUsed: teragas_used_by_date,
      })
    );
    console.log("TERAGAS_USED_BY_DATE updated.");
  } catch (error) {
    console.log(error);
  }
}

async function aggregateDepositAmountByDate() {
  try {
    const depositAmountByDate = await queryDepositAmountAggregatedByDate();
    DEPOSIT_AMOUNT_AGGREGATED_BY_DATE = depositAmountByDate.map(
      ({ date: dateString, total_deposit_amount }) => ({
        date: formatDate(new Date(dateString)),
        depositAmount: total_deposit_amount,
      })
    );
    console.log("DEPOSIT_AMOUNT_AGGREGATED_BY_DATE updated.");
  } catch (error) {
    console.log(error);
  }
}

// accounts
async function aggregateNewAccountsCountByDate() {
  try {
    const newAccountsCountAggregatedByDate = await queryNewAccountsCountAggregatedByDate();
    NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = newAccountsCountAggregatedByDate.map(
      ({ date: dateString, new_accounts_count_by_date }) => ({
        date: formatDate(new Date(dateString)),
        accountsCount: new_accounts_count_by_date,
      })
    );
    console.log("NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE updated.");
  } catch (error) {
    console.log(error);
  }
}

async function aggregateDeletedAccountsCountByDate() {
  try {
    const deletedAccountsCountAggregatedByDate = await queryDeletedAccountsAggregatedByDate();
    DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = deletedAccountsCountAggregatedByDate.map(
      ({ date: dateString, deleted_accounts_count_by_date }) => ({
        date: formatDate(new Date(dateString)),
        accountsCount: deleted_accounts_count_by_date,
      })
    );
    console.log("DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE updated.");
  } catch (error) {
    console.log(error);
  }
}

async function aggregateLiveAccountsCountByDate() {
  try {
    const genesisCount = await queryGenesisAccountCount();
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
      changedAccountsCountByDate[0].accountsCount = Number(genesisCount.count);

      let newAccountMap = new Map();
      for (let i = 0; i < NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE.length; i++) {
        newAccountMap.set(
          NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE[i].date,
          Number(NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE[i].accountsCount)
        );
      }

      let deletedAccountMap = new Map();
      for (
        let i = 0;
        i < DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE.length;
        i++
      ) {
        deletedAccountMap.set(
          DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE[i].date,
          Number(DELETED_ACCOUNTS_COUNT_AGGREGATED_BY_DATE[i].accountsCount)
        );
      }

      for (let i = 0; i < changedAccountsCountByDate.length; i++) {
        if (newAccountMap.get(changedAccountsCountByDate[i].date)) {
          changedAccountsCountByDate[i].accountsCount =
            changedAccountsCountByDate[i].accountsCount +
            newAccountMap.get(changedAccountsCountByDate[i].date);
        }
        if (deletedAccountMap.get(changedAccountsCountByDate[i].date)) {
          changedAccountsCountByDate[i].accountsCount =
            changedAccountsCountByDate[i].accountsCount -
            deletedAccountMap.get(changedAccountsCountByDate[i].date);
        }
      }
      LIVE_ACCOUNTS_COUNT_AGGREGATE_BY_DATE = changedAccountsCountByDate.reduce(
        (r, a) => {
          if (r.length > 0) a.accountsCount += r[r.length - 1].accountsCount;
          r.push(a);
          return r;
        },
        Array()
      );
      console.log("LIVE_ACCOUNTS_COUNT_AGGREGATE_BY_DATE updated.");
    }
  } catch (error) {
    console.log(error);
  }
}

async function aggregateActiveAccountsCountByDate() {
  try {
    const activeAccountsCountByDate = await queryActiveAccountsCountAggregatedByDate();
    ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = activeAccountsCountByDate.map(
      ({ date: dateString, active_accounts_count_by_date }) => ({
        date: formatDate(new Date(dateString)),
        accountsCount: active_accounts_count_by_date,
      })
    );
    console.log("ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_DATE updated.");
  } catch (error) {
    console.log(error);
  }
}

async function aggregateActiveAccountsCountByWeek() {
  try {
    const activeAccountsCountByWeek = await queryActiveAccountsCountAggregatedByWeek();
    ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_WEEK = activeAccountsCountByWeek.map(
      ({ date: dateString, active_accounts_count_by_week }) => ({
        date: formatDate(new Date(dateString)),
        accountsCount: active_accounts_count_by_week,
      })
    );
    console.log("ACTIVE_ACCOUNTS_COUNT_AGGREGATED_BY_WEEK updated.");
  } catch (error) {
    console.log(error);
  }
}

async function aggregateActiveAccountsList() {
  try {
    const activeAccountsList = await queryActiveAccountsList();
    ACTIVE_ACCOUNTS_LIST = activeAccountsList.map(
      ({
        signer_account_id: account,
        transactions_count: transactionsCount,
      }) => ({
        account,
        transactionsCount,
      })
    );
    console.log("ACTIVE_ACCOUNTS_LIST updated.");
  } catch (error) {
    console.log(error);
  }
}

// contracts
async function aggregateNewContractsCountByDate() {
  try {
    const newContractsByDate = await queryNewContractsCountAggregatedByDate();
    NEW_CONTRACTS_COUNT_AGGREGATED_BY_DATE = newContractsByDate.map(
      ({ date: dateString, new_contracts_count_by_date }) => ({
        date: formatDate(new Date(dateString)),
        contractsCount: new_contracts_count_by_date,
      })
    );
    console.log("NEW_CONTRACTS_COUNT_AGGREGATED_BY_DATE updated.");
  } catch (error) {
    console.log(error);
  }
}

async function aggregateActiveContractsCountByDate() {
  try {
    const activeContractsCountByDate = await queryActiveContractsCountAggregatedByDate();
    ACTIVE_CONTRACTS_COUNT_AGGREGATED_BY_DATE = activeContractsCountByDate.map(
      ({ date: dateString, active_contracts_count_by_date }) => ({
        date: formatDate(new Date(dateString)),
        contractsCount: active_contracts_count_by_date,
      })
    );
    console.log("ACTIVE_CONTRACTS_COUNT_AGGREGATED_BY_DATE updated.");
  } catch (error) {
    console.log(error);
  }
}

async function aggregateUniqueDeployedContractsCountByDate() {
  try {
    const contractList = await queryUniqueDeployedContractsAggregatedByDate();
    const contractsRows = contractList.map(
      ({ date: dateString, deployed_contracts_by_date }) => ({
        date: formatDate(new Date(dateString)),
        deployedContracts: deployed_contracts_by_date,
      })
    );
    let cumulativeContractsDeployedByDate = new Array();
    let contractsDeployed = new Set([contractsRows[0].deployedContracts]);

    for (let i = 1; i < contractsRows.length; i++) {
      if (contractsRows[i].date !== contractsRows[i - 1].date) {
        cumulativeContractsDeployedByDate.push({
          date: contractsRows[i - 1].date,
          contractsCount: contractsDeployed.size,
        });
      }
      contractsDeployed.add(contractsRows[i].deployedContracts);
    }
    UNIQUE_DEPLOYED_CONTRACTS_COUNT_AGGREGATED_BY_DATE = cumulativeContractsDeployedByDate;
    console.log("UNIQUE_DEPLOYED_CONTRACTS_COUNT_AGGREGATED_BY_DATE updated.");
  } catch (error) {
    console.log(error);
  }
}

async function aggregateActiveContractsList() {
  try {
    const activeContractsList = await queryActiveContractsList();
    ACTIVE_CONTRACTS_LIST = activeContractsList.map(
      ({ receiver_account_id: contract, receipts_count: receiptsCount }) => ({
        contract,
        receiptsCount,
      })
    );
    console.log("ACTIVE_CONTRACTS_LIST updated.");
  } catch (error) {
    console.log(error);
  }
}

// partner part
async function aggregatePartnerTotalTransactionsCount() {
  try {
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
    console.log("PARTNER_TOTAL_TRANSACTIONS_COUNT updated");
  } catch (error) {
    console.log(error);
  }
}

async function aggregatePartnerFirst3MonthTransactionsCount() {
  try {
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
    console.log("PARTNER_FIRST_3_MONTH_TRANSACTIONS_COUNT updated");
    return partnerFirst3MonthTransactionsCount;
  } catch (error) {
    console.log(error);
  }
}

async function aggregateParterUniqueUserAmount() {
  try {
    const partnerUniqueUserAmount = await queryPartnerUniqueUserAmount();
    PARTNER_UNIQUE_USER_AMOUNT = partnerUniqueUserAmount.map(
      ({ receiver_account_id: account, user_amount: userAmount }) => ({
        account,
        userAmount,
      })
    );
    console.log("PARTNER_UNIQUE_USER_AMOUNT updated");
  } catch (error) {
    console.log(error);
  }
}

// get function that exposed to frontend
// transaction related
async function getTransactionsByDate() {
  return TRANSACTIONS_COUNT_AGGREGATED_BY_DATE;
}

async function getTeragasUsedByDate() {
  return TERAGAS_USED_BY_DATE;
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

async function getNewContractsCountByDate() {
  return NEW_CONTRACTS_COUNT_AGGREGATED_BY_DATE;
}

async function getUniqueDeployedContractsCountByDate() {
  return UNIQUE_DEPLOYED_CONTRACTS_COUNT_AGGREGATED_BY_DATE;
}

async function getActiveContractsCountByDate() {
  return ACTIVE_CONTRACTS_COUNT_AGGREGATED_BY_DATE;
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

// aggregate part
// transaction related
exports.aggregateTransactionsCountByDate = aggregateTransactionsCountByDate;
exports.aggregateTeragasUsedByDate = aggregateTeragasUsedByDate;
exports.aggregateDepositAmountByDate = aggregateDepositAmountByDate;

// accounts
exports.aggregateNewAccountsCountByDate = aggregateNewAccountsCountByDate;
exports.aggregateDeletedAccountsCountByDate = aggregateDeletedAccountsCountByDate;
exports.aggregateLiveAccountsCountByDate = aggregateLiveAccountsCountByDate;
exports.aggregateActiveContractsCountByDate = aggregateActiveContractsCountByDate;
exports.aggregateActiveAccountsCountByDate = aggregateActiveAccountsCountByDate;
exports.aggregateActiveAccountsCountByWeek = aggregateActiveAccountsCountByWeek;
exports.aggregateActiveAccountsList = aggregateActiveAccountsList;

// contracts
exports.aggregateNewContractsCountByDate = aggregateNewContractsCountByDate;
exports.aggregateActiveContractsCountByDate = aggregateActiveContractsCountByDate;
exports.aggregateUniqueDeployedContractsCountByDate = aggregateUniqueDeployedContractsCountByDate;
exports.aggregateActiveContractsList = aggregateActiveContractsList;

// partner part
exports.aggregatePartnerTotalTransactionsCount = aggregatePartnerTotalTransactionsCount;
exports.aggregatePartnerFirst3MonthTransactionsCount = aggregatePartnerFirst3MonthTransactionsCount;
exports.aggregateParterUniqueUserAmount = aggregateParterUniqueUserAmount;

// get method
// transaction related
exports.getTransactionsByDate = getTransactionsByDate;
exports.getTeragasUsedByDate = getTeragasUsedByDate;
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
