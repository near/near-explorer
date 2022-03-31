const {
  queryIndexedTransaction,
  queryTransactionsList,
  queryTransactionsActionsList,
  queryAccountTransactionsList,
  queryTransactionsListInBlock,
  queryTransactionInfo,
} = require("./db-utils");

const INDEXER_COMPATIBILITY_TRANSACTION_ACTION_KINDS = new Map([
  ["ADD_KEY", "AddKey"],
  ["CREATE_ACCOUNT", "CreateAccount"],
  ["DELETE_ACCOUNT", "DeleteAccount"],
  ["DELETE_KEY", "DeleteKey"],
  ["DEPLOY_CONTRACT", "DeployContract"],
  ["FUNCTION_CALL", "FunctionCall"],
  ["STAKE", "Stake"],
  ["TRANSFER", "Transfer"],
]);

// helper function to init transactions list
// as we use the same structure but different queries for account, block, txInfo and list
async function createTransactionsList(transactionsArray) {
  const transactionsHashes = transactionsArray.map(({ hash }) => hash);
  const transactionsActionsList = await getTransactionsActionsList(
    transactionsHashes
  );

  return transactionsArray.map((transaction) => ({
    hash: transaction.hash,
    signerId: transaction.signer_id,
    receiverId: transaction.receiver_id,
    blockHash: transaction.block_hash,
    blockTimestamp: parseInt(transaction.block_timestamp),
    transactionIndex: transaction.transaction_index,
    actions: transactionsActionsList.get(transaction.hash),
  }));
}

function getIndexerCompatibilityTransactionActionKinds() {
  return INDEXER_COMPATIBILITY_TRANSACTION_ACTION_KINDS;
}

async function getIsTransactionIndexed(transactionHash) {
  const transaction = await queryIndexedTransaction(transactionHash);
  return Boolean(transaction?.transaction_hash);
}

async function getTransactionsList(limit, paginationIndexer) {
  const transactionsList = await queryTransactionsList(
    limit,
    paginationIndexer
  );
  if (transactionsList.length === 0) {
    // we should return an empty array instead of undefined
    // to allow our ListHandler to work properly
    return [];
  }
  return await createTransactionsList(transactionsList);
}

async function getAccountTransactionsList(accountId, limit, paginationIndexer) {
  const accountTxList = await queryAccountTransactionsList(
    accountId,
    limit,
    paginationIndexer
  );
  if (accountTxList.length === 0) {
    // we should return an empty array instead of undefined
    // to allow our ListHandler to work properly
    return [];
  }
  return await createTransactionsList(accountTxList);
}

async function getTransactionsListInBlock(blockHash, limit, paginationIndexer) {
  const txListInBlock = await queryTransactionsListInBlock(
    blockHash,
    limit,
    paginationIndexer
  );
  if (txListInBlock.length === 0) {
    // we should return an empty array instead of undefined
    // to allow our ListHandler to work properly
    return [];
  }
  return await createTransactionsList(txListInBlock);
}

async function getTransactionInfo(transactionHash) {
  const transactionInfo = await queryTransactionInfo(transactionHash);
  if (!transactionInfo) {
    return undefined;
  }
  const transaction = await createTransactionsList([transactionInfo]);
  return transaction[0];
}

async function getTransactionsActionsList(transactionsHashes) {
  const transactionsActionsByHash = new Map();
  const transactionsActions = await queryTransactionsActionsList(
    transactionsHashes
  );
  if (transactionsActions.length === 0) {
    return transactionsActionsByHash;
  }
  transactionsActions.forEach((action) => {
    const txAction =
      transactionsActionsByHash.get(action.transaction_hash) || [];
    return transactionsActionsByHash.set(action.transaction_hash, [
      ...txAction,
      {
        kind: INDEXER_COMPATIBILITY_TRANSACTION_ACTION_KINDS.get(action.kind),
        args:
          typeof action.args === "string"
            ? JSON.parse(action.args)
            : action.args,
      },
    ]);
  });
  return transactionsActionsByHash;
}

exports.getIndexerCompatibilityTransactionActionKinds = getIndexerCompatibilityTransactionActionKinds;
exports.getIsTransactionIndexed = getIsTransactionIndexed;
exports.getTransactionsList = getTransactionsList;
exports.getTransactionsActionsList = getTransactionsActionsList;
exports.getAccountTransactionsList = getAccountTransactionsList;
exports.getTransactionsListInBlock = getTransactionsListInBlock;
exports.getTransactionInfo = getTransactionInfo;
