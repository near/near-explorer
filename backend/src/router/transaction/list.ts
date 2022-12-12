import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "../../context";
import { validators } from "../validators";
import { Indexer, indexerDatabase } from "../../database/databases";
import { SelectQueryBuilder, sql } from "kysely";
import { nanosecondsToMilliseconds } from "../../utils/bigint";
import {
  mapDatabaseTransactionStatus,
  TransactionStatus,
} from "../../utils/transaction-status";
import {
  Action,
  DatabaseAction,
  mapDatabaseActionToAction,
} from "../../utils/actions";
import { id } from "../../common";

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
  cursor: z.infer<typeof validators.transactionPagination>;
};

const getTransactionList = async (
  limit: number,
  cursor?: z.infer<typeof validators.transactionPagination>,
  withCondition: <O>(
    selection: SelectQueryBuilder<Indexer.ModelTypeMap, "transactions", O>
  ) => SelectQueryBuilder<Indexer.ModelTypeMap, "transactions", O> = id
): Promise<TransactionList> => {
  let selection = withCondition(
    indexerDatabase.selectFrom("transactions")
  ).select([
    sql`distinct transactions.transaction_hash`.castTo<string>().as("hash"),
    "transactions.signer_account_id as signerId",
    "transactions.receiver_account_id as receiverId",
    "transactions.included_in_block_hash as blockHash",
    "transactions.block_timestamp as timestamp",
    "transactions.index_in_chunk as indexInChunk",
    "transactions.status",
  ]);
  if (cursor !== undefined) {
    selection = selection.where((wi) =>
      wi
        .where("transactions.block_timestamp", "<", cursor.timestamp)
        .orWhere((wi) =>
          wi
            .where("transactions.block_timestamp", "=", cursor.timestamp)
            .where("transactions.index_in_chunk", "<", cursor.indexInChunk)
        )
    );
  }
  const transactions = await selection
    .orderBy("transactions.block_timestamp", "desc")
    .orderBy("transactions.index_in_chunk", "desc")
    .limit(limit)
    .execute();

  if (transactions.length === 0) {
    return {
      items: [],
      cursor: {
        timestamp: "",
        indexInChunk: 0,
      },
    };
  }

  const transactionsActions = await indexerDatabase
    .selectFrom("transaction_actions")
    .select(["transaction_hash as hash", "action_kind as kind", "args"])
    .where(
      "transaction_hash",
      "in",
      transactions.map(({ hash }) => hash)
    )
    .orderBy("transaction_hash")
    .execute();
  const transactionsActionsList = transactionsActions.reduce(
    (mapping, action) =>
      mapping.set(action.hash, [
        ...(mapping.get(action.hash) || []),
        mapDatabaseActionToAction(action as DatabaseAction),
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

export const router = trpc
  .router<Context>()
  .query("listByTimestamp", {
    input: z.strictObject({
      limit: validators.limit,
      cursor: validators.transactionPagination.optional(),
    }),
    resolve: async ({ input: { limit, cursor } }) => {
      return getTransactionList(limit, cursor);
    },
  })
  .query("listByAccountId", {
    input: z.strictObject({
      accountId: validators.accountId,
      limit: validators.limit,
      cursor: validators.transactionPagination.optional(),
    }),
    resolve: async ({ input: { accountId, limit, cursor } }) => {
      return getTransactionList(limit, cursor, (selection) =>
        selection
          .innerJoin("receipts", (jb) =>
            jb.onRef(
              "transactions.transaction_hash",
              "=",
              "receipts.originated_from_transaction_hash"
            )
          )
          .where((jb) =>
            jb
              .where("receipts.predecessor_account_id", "=", accountId)
              .orWhere("receipts.receiver_account_id", "=", accountId)
          )
      );
    },
  })
  .query("listByBlockHash", {
    input: z.strictObject({
      blockHash: validators.blockHash,
      limit: validators.limit,
      cursor: validators.transactionPagination.optional(),
    }),
    resolve: async ({ input: { blockHash, limit, cursor } }) => {
      return getTransactionList(limit, cursor, (selection) =>
        selection.where("included_in_block_hash", "=", blockHash)
      );
    },
  });
