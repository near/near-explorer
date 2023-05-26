import { SelectQueryBuilder } from "kysely";
import { z } from "zod";

import { IndexerDatabase, indexerDatabase } from "@/backend/database/databases";
import { commonProcedure } from "@/backend/router/trpc";
import { validators } from "@/backend/router/validators";
import {
  Action,
  mapActionResultsWithDelegateActions,
  mapForceDatabaseActionToAction,
} from "@/backend/utils/actions";
import { nanosecondsToMilliseconds } from "@/backend/utils/bigint";
import {
  mapDatabaseTransactionStatus,
  TransactionStatus,
} from "@/backend/utils/transaction-status";
import { id } from "@/common/utils/utils";

type TransactionPreview = {
  hash: string;
  signerId: string;
  receiverId: string;
  blockHash: string;
  blockTimestamp: number;
  actions: Action[];
  status: TransactionStatus;
};

type TransactionList = {
  items: TransactionPreview[];
  cursor?: z.infer<typeof validators.transactionPagination>;
};

const getTransactionList = async (
  limit: number,
  cursor?: z.infer<typeof validators.transactionPagination> | null,
  withCondition: <O>(
    selection: SelectQueryBuilder<IndexerDatabase, "transactions", O>
  ) => SelectQueryBuilder<IndexerDatabase, "transactions", O> = id
): Promise<TransactionList> => {
  let selection = withCondition(
    indexerDatabase.selectFrom("transactions")
  ).select([
    "transaction_hash as hash",
    "signer_account_id as signerId",
    "receiver_account_id as receiverId",
    "included_in_block_hash as blockHash",
    "block_timestamp as timestamp",
    "index_in_chunk as indexInChunk",
    "status",
  ]);
  if (cursor) {
    selection = selection.where((wi) =>
      wi
        .where("block_timestamp", "<", cursor.timestamp)
        .orWhere((subWi) =>
          subWi
            .where("block_timestamp", "=", cursor.timestamp)
            .where("index_in_chunk", "<", cursor.indexInChunk)
        )
    );
  }
  const transactions = await selection
    .orderBy("block_timestamp", "desc")
    .orderBy("index_in_chunk", "desc")
    .limit(limit)
    .execute();

  if (transactions.length === 0) {
    return {
      items: [],
    };
  }

  const transactionsActions = await indexerDatabase
    .selectFrom("transaction_actions")
    .select([
      "transaction_hash as hash",
      "action_kind as kind",
      "args",
      "transaction_actions.delegate_parameters as delegateParameters",
      "transaction_actions.delegate_parent_index_in_transaction as delegateIndex",
    ])
    .where(
      "transaction_hash",
      "in",
      transactions.map(({ hash }) => hash)
    )
    .orderBy("transaction_hash")
    .execute();
  const transactionsActionsList = mapActionResultsWithDelegateActions(
    transactionsActions,
    (transactionA, transactionB) => transactionA.hash === transactionB.hash
  ).reduce(
    (mapping, action) =>
      mapping.set(action.hash, [
        ...(mapping.get(action.hash) || []),
        mapForceDatabaseActionToAction(action),
      ]),
    new Map<string, Action[]>()
  );
  const lastTransaction = transactions[transactions.length - 1];
  return {
    items: transactions.map((transaction) => ({
      hash: transaction.hash,
      signerId: transaction.signerId,
      receiverId: transaction.receiverId,
      blockHash: transaction.blockHash,
      blockTimestamp: nanosecondsToMilliseconds(BigInt(transaction.timestamp)),
      actions: transactionsActionsList.get(transaction.hash) || [],
      status: mapDatabaseTransactionStatus(transaction.status),
    })),
    cursor: {
      timestamp: lastTransaction.timestamp,
      indexInChunk: lastTransaction.indexInChunk,
    },
  };
};

export const procedures = {
  byTimestamp: commonProcedure
    .input(
      z.strictObject({
        limit: validators.limit,
        cursor: validators.transactionPagination.nullish(),
      })
    )
    .query(async ({ input: { limit, cursor } }) =>
      getTransactionList(limit, cursor)
    ),
  byAccountId: commonProcedure
    .input(
      z.strictObject({
        accountId: validators.accountId,
        limit: validators.limit,
        cursor: validators.transactionPagination.nullish(),
      })
    )
    .query(async ({ input: { accountId, limit, cursor } }) =>
      getTransactionList(limit, cursor, (selection) =>
        selection.where("transaction_hash", "in", (eb) =>
          eb
            .selectFrom("receipts")
            .select("originated_from_transaction_hash")
            .where("predecessor_account_id", "=", accountId)
            .orWhere("receiver_account_id", "=", accountId)
        )
      )
    ),
  byBlockHash: commonProcedure
    .input(
      z.strictObject({
        blockHash: validators.blockHash,
        limit: validators.limit,
        cursor: validators.transactionPagination.nullish(),
      })
    )
    .query(async ({ input: { blockHash, limit, cursor } }) =>
      getTransactionList(limit, cursor, (selection) =>
        selection.where("included_in_block_hash", "=", blockHash)
      )
    ),
};
