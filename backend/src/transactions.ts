import {
  Action,
  TransactionBaseInfo,
  TransactionPagination,
} from "./client-types";
import {
  queryIndexedTransaction,
  queryTransactionsList,
  queryTransactionsActionsList,
  queryAccountTransactionsList,
  queryTransactionsListInBlock,
  queryTransactionInfo,
  QueryTransaction,
} from "./db-utils";

const INDEXER_COMPATIBILITY_TRANSACTION_ACTION_KINDS = new Map<
  string,
  Action["kind"]
>([
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
async function createTransactionsList(
  transactionsArray: QueryTransaction[]
): Promise<TransactionBaseInfo[]> {
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
    actions: transactionsActionsList.get(transaction.hash) || [],
  }));
}

function getIndexerCompatibilityTransactionActionKinds(): Map<
  string,
  Action["kind"]
> {
  return INDEXER_COMPATIBILITY_TRANSACTION_ACTION_KINDS;
}

async function getIsTransactionIndexed(
  transactionHash: string
): Promise<boolean> {
  const transaction = await queryIndexedTransaction(transactionHash);
  return Boolean(transaction?.transaction_hash);
}

async function getTransactionsList(
  limit?: number,
  paginationIndexer?: TransactionPagination
): Promise<TransactionBaseInfo[]> {
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

async function getAccountTransactionsList(
  accountId: string,
  limit?: number,
  paginationIndexer?: TransactionPagination
): Promise<TransactionBaseInfo[]> {
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

async function getTransactionsListInBlock(
  blockHash: string,
  limit?: number,
  paginationIndexer?: TransactionPagination
): Promise<TransactionBaseInfo[]> {
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

async function getTransactionInfo(
  transactionHash: string
): Promise<TransactionBaseInfo | null> {
  const transactionInfo = await queryTransactionInfo(transactionHash);
  if (!transactionInfo) {
    return null;
  }
  const transaction = await createTransactionsList([transactionInfo]);
  return transaction[0] || null;
}

function convertDbArgsToRpcArgs(
  kind: string,
  jsonArgs: Record<string, unknown>
): Action["args"] {
  switch (kind) {
    case "FUNCTION_CALL":
      return {
        ...jsonArgs,
        args_base64: undefined,
        args_json: undefined,
        args: jsonArgs.args_base64,
      };
    case "ADD_KEY": {
      const dbArgs = jsonArgs as any;
      if (dbArgs.access_key.permission.permission_kind === "FULL_ACCESS") {
        return {
          ...dbArgs,
          access_key: {
            ...dbArgs.access_key,
            permission: "FullAccess",
          },
        };
      } else {
        return {
          ...dbArgs,
          access_key: {
            ...dbArgs.access_key,
            permission: {
              FunctionCall: dbArgs.access_key.permission.permission_details,
            },
          },
        };
      }
    }
    case "DEPLOY_CONTRACT":
      return {
        code: jsonArgs.code_sha256,
      };
    default:
      return jsonArgs;
  }
}

async function getTransactionsActionsList(
  transactionsHashes: string[]
): Promise<Map<string, Action[]>> {
  const transactionsActionsByHash = new Map<string, Action[]>();
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
        args: convertDbArgsToRpcArgs(action.kind, action.args),
      } as Action,
    ]);
  });
  return transactionsActionsByHash;
}

export {
  getIndexerCompatibilityTransactionActionKinds,
  getIsTransactionIndexed,
  getTransactionsList,
  getAccountTransactionsList,
  getTransactionsListInBlock,
  getTransactionInfo,
};
