const {
  queryIndexedAccount,
  queryAccountsList,
  queryAccountInfo,
  queryAccountOutcomeTransactionsCount,
  queryAccountIncomeTransactionsCount,
  queryAccountActivity,
} = require("./db-utils");

const {
  getIndexerCompatibilityTransactionActionKinds,
} = require("./transactions");

async function isAccountIndexed(accountId) {
  const account = await queryIndexedAccount(accountId);
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
  const [outcomeTransactions, incomeTransactions] = await Promise.all([
    queryAccountOutcomeTransactionsCount(accountId),
    queryAccountIncomeTransactionsCount(accountId),
  ]);
  return {
    inTransactionsCount: incomeTransactions ? parseInt(incomeTransactions) : 0,
    outTransactionsCount: outcomeTransactions
      ? parseInt(outcomeTransactions)
      : 0,
  };
}

async function getAccountInfo(accountId) {
  const accountInfo = await queryAccountInfo(accountId);
  if (!accountInfo) {
    return undefined;
  }
  return {
    accountId: accountInfo.account_id,
    createdByTransactionHash:
      accountInfo.created_by_transaction_hash || undefined,
    createdAtBlockTimestamp: accountInfo.created_at_block_timestamp
      ? parseInt(accountInfo.created_at_block_timestamp)
      : undefined,
    deletedByTransactionHash:
      accountInfo.deleted_by_transaction_hash || undefined,
    deletedAtBlockTimestamp: accountInfo.deleted_at_block_timestamp
      ? parseInt(accountInfo.deleted_at_block_timestamp)
      : undefined,
  };
}

async function getAccountActivity(accountId) {
  const accountActivity = await queryAccountActivity(accountId);
  if (!accountActivity) {
    return undefined;
  }
  const indexerCompatibilityTransactionActionKinds = getIndexerCompatibilityTransactionActionKinds();
  return accountActivity.map((activity) => ({
    timestamp: activity.timestamp,
    updateReason: activity.update_reason,
    nonstakedBalance: activity.nonstaked_balance,
    stakedBalance: activity.staked_balance,
    storageUsage: activity.storage_usage,
    signerId: activity.receipt_signer_id || activity.transaction_signer_id,
    receiverId:
      activity.receipt_receiver_id || activity.transaction_receiver_id,
    action: {
      kind: activity.transaction_transaction_kind
        ? indexerCompatibilityTransactionActionKinds.get(
            activity.transaction_transaction_kind
          )
        : activity.receipt_kind
        ? indexerCompatibilityTransactionActionKinds.get(activity.receipt_kind)
        : activity.update_reason,
      args: activity.transaction_args
        ? typeof activity.transaction_args === "string"
          ? JSON.parse(activity.transaction_args)
          : activity.transaction_args
        : typeof activity.receipt_args === "string"
        ? JSON.parse(activity.receipt_args)
        : activity.receipt_args,
    },
  }));
}

exports.isAccountIndexed = isAccountIndexed;
exports.getAccountsList = getAccountsList;
exports.getAccountTransactionsCount = getAccountTransactionsCount;
exports.getAccountInfo = getAccountInfo;
exports.getAccountActivity = getAccountActivity;
