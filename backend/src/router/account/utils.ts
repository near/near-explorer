import { sql } from "kysely";

import {
  analyticsDatabase,
  indexerDatabase,
} from "@explorer/backend/database/databases";
import { count, max, sum } from "@explorer/backend/database/utils";
import { millisecondsToNanoseconds } from "@explorer/backend/utils/bigint";
import { DAY } from "@explorer/backend/utils/time";

const queryAccountIncomeTransactionsCount = async (accountId: string) => {
  if (!analyticsDatabase) {
    return;
  }
  const dailyTransactionsSelection = await analyticsDatabase
    .selectFrom("daily_ingoing_transactions_per_account_count")
    .select([
      (eb) => sum(eb, "ingoing_transactions_count").as("transactionsCount"),
      (eb) => max(eb, "collected_for_day").as("lastDayCollectedTimestamp"),
    ])
    .where("account_id", "=", accountId)
    .executeTakeFirstOrThrow();

  // since analytics are collected for the previous day,
  // then 'lastDayCollectedTimestamp' may be 'null' for just created accounts so
  // we must put 'lastDayCollectedTimestamp' as below to dislay correct value
  const lastDayCollectedTimestamp = millisecondsToNanoseconds(
    dailyTransactionsSelection.lastDayCollectedTimestamp
      ? dailyTransactionsSelection.lastDayCollectedTimestamp.getTime() + DAY
      : new Date().getTime() - DAY
  ).toString();

  const lastDayTransactionSelection = await indexerDatabase
    .selectFrom("transactions")
    // TODO: Research if we can get rid of distinct without performance degradation
    .select(
      sql<string>`count(distinct transactions.transaction_hash)`.as(
        "transactionsCount"
      )
    )
    .leftJoin("receipts", (jb) =>
      jb
        .onRef("originated_from_transaction_hash", "=", "transaction_hash")
        .on("block_timestamp", ">=", lastDayCollectedTimestamp)
    )
    .where("included_in_block_timestamp", ">=", lastDayCollectedTimestamp)
    .where("signer_account_id", "!=", accountId)
    .where("receipts.receiver_account_id", "=", accountId)
    .executeTakeFirst();

  return (
    parseInt(dailyTransactionsSelection.transactionsCount || "0", 10) +
    parseInt(lastDayTransactionSelection?.transactionsCount || "0", 10)
  );
};

const queryAccountOutcomeTransactionsCount = async (accountId: string) => {
  if (!analyticsDatabase) {
    return;
  }
  const dailyTransactionsSelection = await analyticsDatabase
    .selectFrom("daily_outgoing_transactions_per_account_count")
    .select([
      (eb) => sum(eb, "outgoing_transactions_count").as("transactionsCount"),
      (eb) => max(eb, "collected_for_day").as("lastDayCollectedTimestamp"),
    ])
    .where("account_id", "=", accountId)
    .executeTakeFirstOrThrow();

  // since analytics are collected for the previous day,
  // then 'lastDayCollectedTimestamp' may be 'null' for just created accounts so
  // we must put 'lastDayCollectedTimestamp' as below to dislay correct value
  const lastDayCollectedTimestamp = millisecondsToNanoseconds(
    dailyTransactionsSelection.lastDayCollectedTimestamp
      ? dailyTransactionsSelection.lastDayCollectedTimestamp.getTime() + DAY
      : new Date().getTime() - DAY
  ).toString();

  const lastDayTransactionSelection = await indexerDatabase
    .selectFrom("transactions")
    .select((eb) => count(eb, "transaction_hash").as("transactionsCount"))
    .where("signer_account_id", "=", accountId)
    .where("block_timestamp", ">=", lastDayCollectedTimestamp)
    .executeTakeFirstOrThrow();

  return (
    parseInt(dailyTransactionsSelection.transactionsCount || "0", 10) +
    parseInt(lastDayTransactionSelection.transactionsCount || "0", 10)
  );
};

export const getAccountTransactionsCount = async (accountId: string) => {
  const [inTransactionsCount, outTransactionsCount] = await Promise.all([
    queryAccountOutcomeTransactionsCount(accountId),
    queryAccountIncomeTransactionsCount(accountId),
  ]);
  if (inTransactionsCount === undefined || outTransactionsCount === undefined) {
    return;
  }
  return {
    inTransactionsCount,
    outTransactionsCount,
  };
};
