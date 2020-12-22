const {
  queryTransactionsByDate,
  queryTeragasUsedByDate,
  queryNewAccountsByDate,
  queryNewContractsByDate,
} = require("./db-utils");
const { formatDate } = require("./utils");

let TRANSACTIONS_BY_DATE = null;
let TERAGAS_USED_BY_DATE = null;
let NEW_ACCOUNTS_BY_DATE = null;
let NEW_CONTRACTS_BY_DATE = null;

const calculateTransactionsByDate = async function () {
  try {
    const transactionsByDate = await queryTransactionsByDate();
    TRANSACTIONS_BY_DATE = transactionsByDate.map(
      ({ date: dateString, transactions_by_date }) => ({
        date: formatDate(new Date(dateString)),
        transactionsCount: transactions_by_date,
      })
    );
    console.log("TRANSACTIONS_BY_DATE updated.");
  } catch (error) {
    console.log(error);
  }
};

const calculateTeragasUsedByDate = async function () {
  try {
    const teragasUsedByDate = await queryTeragasUsedByDate();
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

const calculateNewAccountsByDate = async function () {
  try {
    const newAccountsByDate = await queryNewAccountsByDate();
    NEW_ACCOUNTS_BY_DATE = newAccountsByDate.map(
      ({ date: dateString, new_accounts_by_date }) => ({
        date: formatDate(new Date(dateString)),
        accountsCount: new_accounts_by_date,
      })
    );
    console.log("NEW_ACCOUNTS_BY_DATE updated.");
  } catch (error) {
    console.log(error);
  }
};

const calculateNewContractsByDate = async function () {
  try {
    const newContractsByDate = await queryNewContractsByDate();
    NEW_CONTRACTS_BY_DATE = newContractsByDate.map(
      ({ date: dateString, new_contracts_by_date }) => ({
        date: formatDate(new Date(dateString)),
        contractsCount: new_contracts_by_date,
      })
    );
    console.log("NEW_CONTRACTS_BY_DATE updated.");
  } catch (error) {
    console.log(error);
  }
};

const getTransactionsByDate = async function () {
  return TRANSACTIONS_BY_DATE;
};

const getTeragasUsedByDate = async function () {
  return TERAGAS_USED_BY_DATE;
};

const getNewAccountsByDate = async function () {
  return NEW_ACCOUNTS_BY_DATE;
};

const getNewContractsByDate = async function () {
  return NEW_CONTRACTS_BY_DATE;
};

exports.calculateTransactionsByDate = calculateTransactionsByDate;
exports.calculateTeragasUsedByDate = calculateTeragasUsedByDate;
exports.calculateNewAccountsByDate = calculateNewAccountsByDate;
exports.calculateNewContractsByDate = calculateNewContractsByDate;

exports.getTransactionsByDate = getTransactionsByDate;
exports.getTeragasUsedByDate = getTeragasUsedByDate;
exports.getNewAccountsByDate = getNewAccountsByDate;
exports.getNewContractsByDate = getNewContractsByDate;
