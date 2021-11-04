const {
  queryIsAccountIndexed,
  queryAccountsList,
  queryAccountTransactionsCount,
  queryAccountInfo,
} = require("./db-utils");

async function isAccountIndexed(accountId) {
  const account = await queryIsAccountIndexed(accountId);
  return Boolean(account?.account_id);
}

async function getAccountsList(limit, paginationIndexer) {
  const accountsList = await queryAccountsList(limit, paginationIndexer);
  return accountsList.map((account) => ({
    accountId: account.account_id,
    createdAtBlockTimestamp: parseInt(account.created_at_block_timestamp),
    accountIndex: parseInt(account.account_index),
  }));
}

async function getAccountTransactionsCount(accountId) {
  const accountStats = await queryAccountTransactionsCount(accountId);
  return {
    inTransactionsCount: parseInt(accountStats.in_transactions_count),
    outTransactionsCount: parseInt(accountStats.out_transactions_count),
  };
}

async function getAccountInfo(accountId) {
  const accountInfo = await queryAccountInfo(accountId);
  if (!accountInfo) {
    return undefined;
  }
  return {
    accountId: accountInfo.account_id,
    createdByTransactionHash: accountInfo.created_by_transaction_hash,
    createdAtBlockTimestamp: parseInt(accountInfo.created_at_block_timestamp),
    deletedByTransactionHash: accountInfo.deleted_by_transaction_hash || null,
    deletedAtBlockTimestamp: accountInfo.deleted_at_block_timestamp
      ? parseInt(accountInfo.deleted_at_block_timestamp)
      : null,
  };
}

exports.isAccountIndexed = isAccountIndexed;
exports.getAccountsList = getAccountsList;
exports.getAccountTransactionsCount = getAccountTransactionsCount;
exports.getAccountInfo = getAccountInfo;
