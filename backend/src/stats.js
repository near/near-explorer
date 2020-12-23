const {
  queryTransactionsCountAggregatedByDate,
  queryTeragasUsedAggregatedByDate,
  queryNewAccountsCountAggregatedByDate,
  queryNewContractsCountAggregatedByDate,
} = require("./db-utils");
const { formatDate } = require("./utils");

let TRANSACTIONS_COUNT_AGGREGATED_BY_DATE = null;
let TERAGAS_USED_BY_DATE = null;
let NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE = null;
let NEW_CONTRACTS_COUNT_AGGREGATED_BY_DATE = null;

const aggregateTransactionsCountByDate = async function () {
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
};

const aggregateTeragasUsedByDate = async function () {
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
};

const aggregateNewAccountsCountByDate = async function () {
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
};

const aggregateNewContractsCountByDate = async function () {
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
};

const getTransactionsByDate = async function () {
  return TRANSACTIONS_COUNT_AGGREGATED_BY_DATE;
};

const getTeragasUsedByDate = async function () {
  return TERAGAS_USED_BY_DATE;
};

const getNewAccountsByDate = async function () {
  return NEW_ACCOUNTS_COUNT_AGGREGATED_BY_DATE;
};

const getNewContractsByDate = async function () {
  return NEW_CONTRACTS_COUNT_AGGREGATED_BY_DATE;
};

exports.aggregateTransactionsCountByDate = aggregateTransactionsCountByDate;
exports.aggregateTeragasUsedByDate = aggregateTeragasUsedByDate;
exports.aggregateNewAccountsCountByDate = aggregateNewAccountsCountByDate;
exports.aggregateNewContractsCountByDate = aggregateNewContractsCountByDate;

exports.getTransactionsByDate = getTransactionsByDate;
exports.getTeragasUsedByDate = getTeragasUsedByDate;
exports.getNewAccountsByDate = getNewAccountsByDate;
exports.getNewContractsByDate = getNewContractsByDate;
