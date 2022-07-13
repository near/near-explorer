import { sql } from "kysely";
import { z } from "zod";

import {
  indexerDatabase,
  analyticsDatabase,
  telemetryDatabase,
  Indexer,
} from "./databases";
import { DAY } from "../utils/time";
import { config } from "../config";
import {
  teraGasNomination,
  millisecondsToNanoseconds,
  nearNomination,
} from "../utils/bigint";
import { count, sum, max, div } from "./utils";
import { validators } from "../router/validators";

export const queryGenesisAccountCount = async () => {
  return indexerDatabase
    .selectFrom("accounts")
    .select((eb) => count(eb, "id").as("count"))
    .where("created_by_receipt_id", "is", null)
    .executeTakeFirstOrThrow();
};

// query for node information
export const queryTelemetryInfo = async (accountIds: string[]) => {
  const nodesInfo = await telemetryDatabase
    .selectFrom("nodes")
    .select([
      "ip_address",
      "account_id",
      "node_id",
      "last_seen",
      "last_height",
      "status",
      "agent_name",
      "agent_version",
      "agent_build",
      "latitude",
      "longitude",
      "city",
    ])
    .where("account_id", "in", accountIds)
    .orderBy("last_seen")
    .execute();

  const map = new Map<
    string,
    {
      ipAddress: string;
      nodeId: string;
      lastSeen: number;
      lastHeight: number;
      status: string;
      agentName: string;
      agentVersion: string;
      agentBuild: string;
      latitude: string | null;
      longitude: string | null;
      city: string | null;
    }
  >();
  for (const nodeInfo of nodesInfo) {
    map.set(nodeInfo.account_id, {
      ipAddress: nodeInfo.ip_address,
      nodeId: nodeInfo.node_id,
      lastSeen: nodeInfo.last_seen.valueOf(),
      lastHeight: parseInt(nodeInfo.last_height),
      status: nodeInfo.status,
      agentName: nodeInfo.agent_name,
      agentVersion: nodeInfo.agent_version,
      agentBuild: nodeInfo.agent_build,
      latitude: nodeInfo.latitude,
      longitude: nodeInfo.longitude,
      city: nodeInfo.city,
    });
  }
  return map;
};

export const queryStakingPoolAccountIds = async () => {
  const selection = await indexerDatabase
    .selectFrom("accounts")
    .select("account_id as accountId")
    .where(
      "account_id",
      "like",
      `%${config.accountIdSuffix.stakingPool[config.networkName]}`
    )
    .execute();
  return selection.map(({ accountId }) => accountId);
};

export const queryOnlineNodesCount = async () => {
  const selection = await telemetryDatabase
    .selectFrom("nodes")
    .select((eb) => count(eb, "node_id").as("onlineNodesCount"))
    .where("last_seen", ">", sql`now() - '60 seconds'::interval`)
    .executeTakeFirstOrThrow();
  return parseInt(selection.onlineNodesCount);
};

export const queryLatestBlock = async () => {
  const latestBlockHeightSelection = await indexerDatabase
    .selectFrom("blocks")
    .select([
      "block_height as blockHeight",
      (eb) => div(eb, "block_timestamp", 1000 * 1000, "blockTimestampMs"),
    ])
    .orderBy("block_height", "desc")
    .limit(1)
    .executeTakeFirstOrThrow();
  return {
    height: Number(latestBlockHeightSelection.blockHeight),
    timestamp: Number(latestBlockHeightSelection.blockTimestampMs),
  };
};

export const queryLatestGasPrice = async () => {
  const latestGasPriceSelection = await indexerDatabase
    .selectFrom("blocks")
    .select("gas_price")
    .orderBy("block_height", "desc")
    .limit(1)
    .executeTakeFirstOrThrow();
  return latestGasPriceSelection.gas_price;
};

export const queryRecentBlockProductionSpeed = async () => {
  const lastestBlockTimestampSelection = await indexerDatabase
    .selectFrom("blocks")
    .select("block_timestamp")
    .orderBy("block_timestamp", "desc")
    .limit(1)
    .executeTakeFirst();
  if (!lastestBlockTimestampSelection) {
    return 0;
  }
  const { block_timestamp: latestBlockTimestamp } =
    lastestBlockTimestampSelection;
  const latestBlockTimestampBI = BigInt(latestBlockTimestamp);
  const currentUnixTimeBI = BigInt(Math.floor(new Date().getTime() / 1000));
  const latestBlockEpochTimeBI = latestBlockTimestampBI / 1000000000n;
  // If the latest block is older than 1 minute from now, we report 0
  if (currentUnixTimeBI - latestBlockEpochTimeBI > 60) {
    return 0;
  }

  const selection = await indexerDatabase
    .selectFrom("blocks")
    .select((eb) =>
      count(eb, "block_hash").as("blocks_count_60_seconds_before")
    )
    .where(
      "block_timestamp",
      ">",
      sql`cast(
        ${Number(latestBlockEpochTimeBI)} - 60 as bigint
      ) * 1000 * 1000 * 1000`
    )
    .executeTakeFirstOrThrow();
  return parseInt(selection.blocks_count_60_seconds_before) / 60;
};

export const queryRecentTransactionsCount = async () => {
  const selection = await indexerDatabase
    .selectFrom("transactions")
    .select((eb) => count(eb, "transaction_hash").as("total"))
    .where(
      "block_timestamp",
      ">",
      sql`cast(
        extract(
          epoch from now() - '1 day'::interval
        ) as bigint
      ) * 1000 * 1000 * 1000`
    )
    .executeTakeFirstOrThrow();

  return parseInt(selection.total);
};

// query for statistics and charts
// transactions related
export const queryTransactionsHistory = async () => {
  const selection = await analyticsDatabase
    .selectFrom("daily_transactions_count")
    .select(["collected_for_day as date", "transactions_count as count"])
    .orderBy("date")
    .execute();
  return selection.map<[number, number]>((row) => [
    row.date.valueOf(),
    Number(row.count),
  ]);
};

export const queryGasUsedAggregatedByDate = async () => {
  const selection = await analyticsDatabase
    .selectFrom("daily_gas_used")
    .select(["collected_for_day as date", "gas_used as gasUsed"])
    .orderBy("date")
    .execute();
  return selection.map<[number, number]>(({ date, gasUsed }) => [
    date.valueOf(),
    Number(BigInt(gasUsed) / teraGasNomination),
  ]);
};

export const queryTransactionsList = async (
  limit: number = 15,
  cursor?: z.infer<typeof validators.transactionPagination>
) => {
  let selection = indexerDatabase
    .selectFrom("transactions")
    .select([
      "transaction_hash as hash",
      "signer_account_id as signer_id",
      "receiver_account_id as receiver_id",
      "included_in_block_hash as block_hash",
      (eb) => div(eb, "block_timestamp", 1000 * 1000, "block_timestamp_ms"),
      "index_in_chunk as transaction_index",
    ]);
  if (cursor !== undefined) {
    const endTimestamp = millisecondsToNanoseconds(
      cursor.endTimestamp
    ).toString();
    selection = selection
      .where("block_timestamp", "<", endTimestamp)
      .orWhere((wi) =>
        wi
          .where("block_timestamp", "=", endTimestamp)
          .where("index_in_chunk", "<", cursor.transactionIndex)
      );
  }
  return selection
    .orderBy("block_timestamp", "desc")
    .orderBy("index_in_chunk", "desc")
    .limit(limit)
    .execute();
};

export const queryAccountTransactionsList = async (
  accountId: string,
  limit: number = 15,
  cursor?: z.infer<typeof validators.transactionPagination>
) => {
  let selection = indexerDatabase
    .selectFrom("transactions")
    .select([
      "transaction_hash as hash",
      "signer_account_id as signer_id",
      "receiver_account_id as receiver_id",
      "included_in_block_hash as block_hash",
      (eb) => div(eb, "block_timestamp", 1000 * 1000, "block_timestamp_ms"),
      "index_in_chunk as transaction_index",
    ]);
  if (cursor !== undefined) {
    const endTimestamp = millisecondsToNanoseconds(
      cursor.endTimestamp
    ).toString();
    selection = selection
      .where("transaction_hash", "in", (eb) =>
        eb
          .selectFrom("receipts")
          .select("originated_from_transaction_hash")
          .where("predecessor_account_id", "=", accountId)
          .orWhere("receiver_account_id", "=", accountId)
      )
      .where((wi) =>
        wi
          .where("block_timestamp", "<", endTimestamp)
          .orWhere((wi) =>
            wi
              .where("block_timestamp", "=", endTimestamp)
              .where("index_in_chunk", "<", cursor.transactionIndex)
          )
      );
  } else {
    selection = selection.where("transaction_hash", "in", (eb) =>
      eb
        .selectFrom("receipts")
        .select("originated_from_transaction_hash")
        .where("predecessor_account_id", "=", accountId)
        .orWhere("receiver_account_id", "=", accountId)
    );
  }
  return selection
    .orderBy("block_timestamp", "desc")
    .orderBy("index_in_chunk", "desc")
    .limit(limit)
    .execute();
};

export const queryTransactionsListInBlock = async (
  blockHash: string,
  limit: number = 15,
  cursor?: z.infer<typeof validators.transactionPagination>
) => {
  let selection = indexerDatabase
    .selectFrom("transactions")
    .select([
      "transaction_hash as hash",
      "signer_account_id as signer_id",
      "receiver_account_id as receiver_id",
      "included_in_block_hash as block_hash",
      (eb) => div(eb, "block_timestamp", 1000 * 1000, "block_timestamp_ms"),
      "index_in_chunk as transaction_index",
    ])
    .where("included_in_block_hash", "=", blockHash);
  if (cursor !== undefined) {
    const endTimestamp = millisecondsToNanoseconds(
      cursor.endTimestamp
    ).toString();
    selection = selection.where((wi) =>
      wi
        .where("block_timestamp", "<", endTimestamp)
        .orWhere((wi) =>
          wi
            .where("block_timestamp", "=", endTimestamp)
            .where("index_in_chunk", "<", cursor.transactionIndex)
        )
    );
  }
  return selection
    .orderBy("block_timestamp", "desc")
    .orderBy("index_in_chunk", "desc")
    .limit(limit)
    .execute();
};

export const queryTransactionsActionsList = async (
  transactionHashes: string[]
) => {
  return indexerDatabase
    .selectFrom("transaction_actions")
    .select(["transaction_hash", "action_kind as kind", "args"])
    .where("transaction_hash", "in", transactionHashes)
    .orderBy("transaction_hash")
    .execute();
};

export const queryTransactionInfo = async (transactionHash: string) => {
  return indexerDatabase
    .selectFrom("transactions")
    .select([
      "transaction_hash as hash",
      "signer_account_id as signer_id",
      "receiver_account_id as receiver_id",
      "included_in_block_hash as block_hash",
      (eb) => div(eb, "block_timestamp", 1000 * 1000, "block_timestamp_ms"),
      "index_in_chunk as transaction_index",
    ])
    .where("transaction_hash", "=", transactionHash)
    .orderBy("block_timestamp", "desc")
    .orderBy("index_in_chunk", "desc")
    .limit(1)
    .executeTakeFirst();
};

// accounts
export const queryNewAccountsCountAggregatedByDate = async () => {
  return analyticsDatabase
    .selectFrom("daily_new_accounts_count")
    .select([
      "collected_for_day as date",
      "new_accounts_count as new_accounts_count_by_date",
    ])
    .orderBy("date")
    .execute();
};

export const queryDeletedAccountsCountAggregatedByDate = async () => {
  return analyticsDatabase
    .selectFrom("daily_deleted_accounts_count")
    .select([
      "collected_for_day as date",
      "deleted_accounts_count as deleted_accounts_count_by_date",
    ])
    .orderBy("date")
    .execute();
};

export const queryActiveAccountsCountAggregatedByDate = async () => {
  return analyticsDatabase
    .selectFrom("daily_active_accounts_count")
    .select([
      "collected_for_day as date",
      "active_accounts_count as active_accounts_count_by_date",
    ])
    .orderBy("date")
    .execute();
};

export const queryActiveAccountsCountAggregatedByWeek = async () => {
  return analyticsDatabase
    .selectFrom("weekly_active_accounts_count")
    .select([
      "collected_for_week as date",
      "active_accounts_count as active_accounts_count_by_week",
    ])
    .orderBy("date")
    .execute();
};

export const queryActiveAccountsList = async () => {
  return analyticsDatabase
    .selectFrom("daily_outgoing_transactions_per_account_count")
    .select([
      "account_id",
      (eb) => sum(eb, "outgoing_transactions_count").as("transactions_count"),
    ])
    .where(
      "collected_for_day",
      ">=",
      sql`date_trunc(
        'day', now() - '2 week'::interval
      )`
    )
    .groupBy("account_id")
    .orderBy("transactions_count", "desc")
    .limit(10)
    .execute();
};

export const queryIndexedAccount = async (accountId: string) => {
  return indexerDatabase
    .selectFrom("accounts")
    .select("account_id")
    .where("account_id", "=", accountId)
    .limit(1)
    .executeTakeFirst();
};

export const queryAccountsList = async (
  limit: number = 15,
  cursor?: number
) => {
  let selection = indexerDatabase
    .selectFrom("accounts")
    .select(["account_id", "id as account_index"])
    .leftJoin("receipts", (join) =>
      join.onRef("receipt_id", "=", "created_by_receipt_id")
    );
  if (cursor !== undefined) {
    selection = selection.where("id", "<", cursor.toString());
  }
  return selection.orderBy("account_index", "desc").limit(limit).execute();
};

export const queryAccountFungibleTokenContractIds = async (
  accountId: string
): Promise<string[]> => {
  const selection = await indexerDatabase
    .selectFrom("assets__fungible_token_events")
    .select("emitted_by_contract_account_id as contractId")
    .distinctOn("emitted_by_contract_account_id")
    .where("token_new_owner_account_id", "=", accountId)
    .orWhere("token_old_owner_account_id", "=", accountId)
    .orderBy("emitted_by_contract_account_id", "desc")
    .execute();
  return selection.map((row) => row.contractId);
};

export const queryAccountFungibleTokenHistory = async (
  accountId: string,
  tokenAuthorAccountId: string
) => {
  const selection = await indexerDatabase
    .selectFrom("assets__fungible_token_events")
    .innerJoin("receipts", (qb) =>
      qb.onRef("emitted_for_receipt_id", "=", "receipts.receipt_id")
    )
    .innerJoin("blocks", (qb) =>
      qb.onRef("blocks.block_hash", "=", "receipts.included_in_block_hash")
    )
    .select([
      "amount",
      "token_old_owner_account_id as prevAccountId",
      "token_new_owner_account_id as nextAccountId",
      "emitted_for_receipt_id as receiptId",
      (eb) => div(eb, "emitted_at_block_timestamp", 1000 * 1000, "timestamp"),
      "originated_from_transaction_hash as transactionHash",
      "block_height as blockHeight",
    ])
    .where("emitted_by_contract_account_id", "=", tokenAuthorAccountId)
    .where((wi) =>
      wi
        .where("token_new_owner_account_id", "=", accountId)
        .orWhere("token_old_owner_account_id", "=", accountId)
    )
    .orderBy("emitted_at_block_timestamp", "desc")
    .orderBy("emitted_in_shard_id", "desc")
    .orderBy("emitted_index_of_event_entry_in_shard", "desc")
    // Pagination to be introduced soon..
    .limit(200)
    .execute();
  return selection;
};

export const queryOutcomeTransactionsCountFromAnalytics = async (
  accountId: string
) => {
  const selection = await analyticsDatabase
    .selectFrom("daily_outgoing_transactions_per_account_count")
    .select([
      (eb) =>
        sum(eb, "outgoing_transactions_count").as("out_transactions_count"),
      (eb) => max(eb, "collected_for_day").as("last_day_collected"),
    ])
    .where("account_id", "=", accountId)
    .executeTakeFirstOrThrow();
  return {
    out_transactions_count: selection.out_transactions_count
      ? parseInt(selection.out_transactions_count)
      : 0,
    last_day_collected_timestamp: selection.last_day_collected
      ? millisecondsToNanoseconds(
          selection.last_day_collected.getTime() + DAY
        ).toString()
      : undefined,
  };
};

export const queryOutcomeTransactionsCountFromIndexerForLastDay = async (
  accountId: string,
  lastDayCollectedTimestamp?: string
) => {
  // since analytics are collected for the previous day,
  // then 'lastDayCollectedTimestamp' may be 'null' for just created accounts so
  // we must put 'lastDayCollectedTimestamp' as below to dislay correct value
  const timestamp =
    lastDayCollectedTimestamp ||
    millisecondsToNanoseconds(new Date().getTime() - DAY).toString();
  const selection = await indexerDatabase
    .selectFrom("transactions")
    .select((eb) => count(eb, "transaction_hash").as("out_transactions_count"))
    .where("signer_account_id", "=", accountId)
    .where("block_timestamp", ">=", timestamp)
    .executeTakeFirstOrThrow();
  return parseInt(selection.out_transactions_count);
};

export const queryIncomeTransactionsCountFromAnalytics = async (
  accountId: string
) => {
  const selection = await analyticsDatabase
    .selectFrom("daily_ingoing_transactions_per_account_count")
    .select([
      (eb) => sum(eb, "ingoing_transactions_count").as("in_transactions_count"),
      (eb) => max(eb, "collected_for_day").as("last_day_collected"),
    ])
    .where("account_id", "=", accountId)
    .executeTakeFirstOrThrow();
  return {
    in_transactions_count: selection.in_transactions_count
      ? parseInt(selection.in_transactions_count)
      : 0,
    last_day_collected_timestamp: selection.last_day_collected
      ? millisecondsToNanoseconds(
          selection.last_day_collected.getTime() + DAY
        ).toString()
      : undefined,
  };
};

export const queryIncomeTransactionsCountFromIndexerForLastDay = async (
  accountId: string,
  lastDayCollectedTimestamp?: string
) => {
  // since analytics are collected for the previous day,
  // then 'lastDayCollectedTimestamp' may be 'null' for just created accounts so
  // we must put 'lastDayCollectedTimestamp' as below to dislay correct value
  const timestamp =
    lastDayCollectedTimestamp ||
    millisecondsToNanoseconds(new Date().getTime() - DAY).toString();
  const selection = await indexerDatabase
    .selectFrom("transactions")
    // TODO: Research if we can get rid of distinct without performance degradation
    .select(
      sql<string>`count(distinct transactions.transaction_hash)`.as(
        "in_transactions_count"
      )
    )
    .leftJoin("receipts", (jb) =>
      jb
        .onRef("originated_from_transaction_hash", "=", "transaction_hash")
        .on("block_timestamp", ">=", timestamp)
    )
    .where("included_in_block_timestamp", ">=", timestamp)
    .where("signer_account_id", "!=", accountId)
    .where("receipts.receiver_account_id", "=", accountId)
    .executeTakeFirst();
  if (!selection) {
    return 0;
  }
  return parseInt(selection.in_transactions_count);
};

export const queryAccountInfo = async (accountId: string) => {
  const selection = await indexerDatabase
    .selectFrom((eb) =>
      eb
        .selectFrom("accounts")
        .select([
          "account_id",
          "created_by_receipt_id",
          "deleted_by_receipt_id",
        ])
        .where("account_id", "=", accountId)
        .as("inneraccounts")
    )
    .leftJoin("receipts as creation_receipt", (jb) =>
      jb.onRef("creation_receipt.receipt_id", "=", "created_by_receipt_id")
    )
    .leftJoin("receipts as deletion_receipt", (jb) =>
      jb.onRef("deletion_receipt.receipt_id", "=", "deleted_by_receipt_id")
    )
    .where("account_id", "=", accountId)
    .select([
      "account_id",
      (eb) =>
        div(
          eb,
          "creation_receipt.included_in_block_timestamp",
          1000 * 1000,
          "created_at_block_timestamp"
        ),
      "creation_receipt.originated_from_transaction_hash as created_by_transaction_hash",
      (eb) =>
        div(
          eb,
          "deletion_receipt.included_in_block_timestamp",
          1000 * 1000,
          "deleted_at_block_timestamp"
        ),
      "deletion_receipt.originated_from_transaction_hash as deleted_by_transaction_hash",
    ])
    .executeTakeFirst();
  if (!selection) {
    return;
  }
  return {
    // TODO: Discover how to get rid of non-null type assertion
    accountId: selection.account_id!,
    created:
      selection.created_at_block_timestamp &&
      selection.created_by_transaction_hash
        ? {
            timestamp: selection.created_at_block_timestamp,
            hash: selection.created_by_transaction_hash,
          }
        : undefined,
    deleted:
      selection.deleted_at_block_timestamp &&
      selection.deleted_by_transaction_hash
        ? {
            timestamp: selection.deleted_at_block_timestamp,
            hash: selection.deleted_by_transaction_hash,
          }
        : undefined,
  };
};

// contracts
export const queryNewContractsCountAggregatedByDate = async () => {
  return analyticsDatabase
    .selectFrom("daily_new_contracts_count")
    .select([
      "collected_for_day as date",
      "new_contracts_count as new_contracts_count_by_date",
    ])
    .orderBy("date")
    .execute();
};

export const queryUniqueDeployedContractsCountAggregatedByDate = async () => {
  return analyticsDatabase
    .selectFrom("daily_new_unique_contracts_count")
    .select([
      "collected_for_day as date",
      "new_unique_contracts_count as contracts_count_by_date",
    ])
    .orderBy("date")
    .execute();
};

export const queryActiveContractsCountAggregatedByDate = async () => {
  return analyticsDatabase
    .selectFrom("daily_active_contracts_count")
    .select([
      "collected_for_day as date",
      "active_contracts_count as active_contracts_count_by_date",
    ])
    .orderBy("date")
    .execute();
};

export const queryActiveContractsList = async () => {
  return analyticsDatabase
    .selectFrom("daily_receipts_per_contract_count")
    .select([
      "contract_id",
      (eb) => sum(eb, "receipts_count").as("receipts_count"),
    ])
    .where(
      "collected_for_day",
      ">=",
      sql`date_trunc(
        'day', now() - '2 week'::interval
      )`
    )
    .groupBy("contract_id")
    .orderBy("receipts_count", "desc")
    .limit(10)
    .execute();
};

export const queryLatestCirculatingSupply = async () => {
  return indexerDatabase
    .selectFrom("aggregated__circulating_supply")
    .select(["circulating_tokens_supply", "computed_at_block_timestamp"])
    .orderBy("computed_at_block_timestamp", "desc")
    .limit(1)
    .executeTakeFirstOrThrow();
};

// pass 'days' to set period of calculation
export const calculateFeesByDay = async (days: number = 1) => {
  return indexerDatabase
    .selectFrom("execution_outcomes")
    .select([
      sql<Date>`date_trunc(
        'day', now() - (${days} || 'days')::interval
      )`.as("date"),
      (eb) => sum(eb, "tokens_burnt").as("fee"),
    ])
    .where(
      "executed_in_block_timestamp",
      ">=",
      sql`cast(
        extract(
          epoch from date_trunc(
            'day', now() - (${days} || 'days')::interval
          )
        ) as bigint
      ) * 1000 * 1000 * 1000`
    )
    .where(
      "executed_in_block_timestamp",
      "<",
      sql`cast(
        extract(
          epoch from date_trunc(
            'day', now() - (${days - 1} || 'days')::interval
          )
        ) as bigint
      ) * 1000 * 1000 * 1000`
    )
    .executeTakeFirst();
};

export const queryTokensSupply = async () => {
  const selection = await indexerDatabase
    .selectFrom("aggregated__circulating_supply")
    .select([
      sql<Date>`date_trunc(
        'day',
        to_timestamp(
          div(
            computed_at_block_timestamp, 1000 * 1000 * 1000
          )
        )
      )`.as("date"),
      "circulating_tokens_supply as circulatingSupply",
      "total_tokens_supply as totalSupply",
    ])
    .orderBy("date")
    .execute();
  return selection.map<[number, number, number]>(
    ({ date, totalSupply, circulatingSupply }) => [
      date.valueOf(),
      Number(BigInt(totalSupply) / nearNomination),
      Number(BigInt(circulatingSupply) / nearNomination),
    ]
  );
};

export const queryBlocksList = async (limit: number = 15, cursor?: number) => {
  const selection = await indexerDatabase
    .selectFrom((eb) => {
      let selection = eb.selectFrom("blocks").select("block_hash");
      if (cursor !== undefined) {
        selection = selection.where(
          "block_timestamp",
          "<",
          millisecondsToNanoseconds(cursor).toString()
        );
      }
      return selection
        .orderBy("block_height", "desc")
        .limit(limit)
        .as("innerblocks");
    })
    .leftJoin("transactions", (jb) =>
      jb.onRef(
        "transactions.included_in_block_hash",
        "=",
        "innerblocks.block_hash"
      )
    )
    .leftJoin("blocks", (jb) =>
      jb.onRef("blocks.block_hash", "=", "innerblocks.block_hash")
    )
    .select([
      "blocks.block_hash as hash",
      "block_height as height",
      (eb) => div(eb, "blocks.block_timestamp", 1000 * 1000, "timestamp"),
      "prev_block_hash as prev_hash",
      (eb) => count(eb, "transaction_hash").as("transactions_count"),
    ])
    .groupBy("blocks.block_hash")
    .orderBy("blocks.block_timestamp", "desc")
    .execute();
  return selection.map((selectionRow) => ({
    // TODO: Discover how to get rid of non-null type assertion
    hash: selectionRow.hash!,
    // TODO: Discover how to get rid of non-null type assertion
    height: selectionRow.height!,
    timestamp: selectionRow.timestamp,
    // TODO: Discover how to get rid of non-null type assertion
    prev_hash: selectionRow.prev_hash!,
    transactions_count: selectionRow.transactions_count,
  }));
};

export const queryBlockInfo = async (blockId: string | number) => {
  const selection = await indexerDatabase
    .selectFrom((eb) => {
      let selection = eb.selectFrom("blocks").select("block_hash");
      if (typeof blockId === "string") {
        selection = selection.where("block_hash", "=", blockId);
      } else {
        selection = selection.where("block_height", "=", String(blockId));
      }
      return selection.as("innerblocks");
    })
    .leftJoin("transactions", (jb) =>
      jb.onRef("included_in_block_hash", "=", "innerblocks.block_hash")
    )
    .leftJoin("blocks", (jb) =>
      jb.onRef("blocks.block_hash", "=", "innerblocks.block_hash")
    )
    .select([
      "blocks.block_hash as hash",
      "block_height as height",
      (eb) => div(eb, "blocks.block_timestamp", 1000 * 1000, "timestamp"),
      "prev_block_hash as prev_hash",
      "gas_price",
      "total_supply",
      "author_account_id",
      (eb) => count(eb, "transaction_hash").as("transactions_count"),
    ])
    .groupBy("blocks.block_hash")
    .orderBy("blocks.block_timestamp", "desc")
    .limit(1)
    .executeTakeFirst();
  if (!selection || !selection.hash) {
    return;
  }
  return {
    // TODO: Discover how to get rid of non-null type assertion
    hash: selection.hash!,
    // TODO: Discover how to get rid of non-null type assertion
    height: selection.height!,
    // TODO: Discover how to get rid of non-null type assertion
    timestamp: selection.timestamp,
    // TODO: Discover how to get rid of non-null type assertion
    prev_hash: selection.prev_hash!,
    // TODO: Discover how to get rid of non-null type assertion
    gas_price: selection.gas_price!,
    // TODO: Discover how to get rid of non-null type assertion
    total_supply: selection.total_supply!,
    // TODO: Discover how to get rid of non-null type assertion
    author_account_id: selection.author_account_id!,
    transactions_count: selection.transactions_count,
  };
};

export const queryBlockByHashOrId = async (blockId: string | number) => {
  let selection = indexerDatabase.selectFrom("blocks").select("block_hash");
  if (typeof blockId === "string") {
    selection = selection.where("block_hash", "=", blockId);
  } else {
    selection = selection.where("block_height", "=", String(blockId));
  }
  return selection.limit(1).executeTakeFirst();
};

// receipts
export const queryReceiptsCountInBlock = async (blockHash: string) => {
  return indexerDatabase
    .selectFrom("receipts")
    .select((eb) => count(eb, "receipt_id").as("count"))
    .where("included_in_block_hash", "=", blockHash)
    .where("receipt_kind", "=", "ACTION")
    .executeTakeFirst();
};

export const queryReceiptInTransaction = async (receiptId: string) => {
  return indexerDatabase
    .selectFrom("receipts")
    .select(["receipt_id", "originated_from_transaction_hash"])
    .where("receipt_id", "=", receiptId)
    .limit(1)
    .executeTakeFirst();
};

export const queryIndexedTransaction = async (transactionHash: string) => {
  return indexerDatabase
    .selectFrom("transactions")
    .select("transaction_hash")
    .where("transaction_hash", "=", transactionHash)
    .limit(1)
    .executeTakeFirst();
};

// expose receipts included in particular block
export const queryIncludedReceiptsList = async (blockHash: string) => {
  return indexerDatabase
    .selectFrom("action_receipt_actions")
    .innerJoin("receipts", (jb) =>
      jb.onRef("receipts.receipt_id", "=", "action_receipt_actions.receipt_id")
    )
    .innerJoin("execution_outcomes", (jb) =>
      jb.onRef(
        "execution_outcomes.receipt_id",
        "=",
        "action_receipt_actions.receipt_id"
      )
    )
    .select([
      "receipts.receipt_id",
      "originated_from_transaction_hash",
      "predecessor_account_id as predecessor_id",
      "receiver_account_id as receiver_id",
      "status",
      "gas_burnt",
      "tokens_burnt",
      "executed_in_block_timestamp",
      "action_kind as kind",
      "args",
    ])
    .where("included_in_block_hash", "=", blockHash)
    .where("receipt_kind", "=", "ACTION")
    .orderBy("included_in_block_hash")
    .orderBy("receipts.index_in_chunk")
    .orderBy("action_receipt_actions.index_in_action_receipt")
    .execute();
};

// query receipts executed in particular block
export const queryExecutedReceiptsList = async (blockHash: string) => {
  return indexerDatabase
    .selectFrom("action_receipt_actions")
    .innerJoin("receipts", (jb) =>
      jb.onRef("receipts.receipt_id", "=", "action_receipt_actions.receipt_id")
    )
    .innerJoin("execution_outcomes", (jb) =>
      jb.onRef(
        "execution_outcomes.receipt_id",
        "=",
        "action_receipt_actions.receipt_id"
      )
    )
    .select([
      "receipts.receipt_id",
      "originated_from_transaction_hash",
      "predecessor_account_id as predecessor_id",
      "receiver_account_id as receiver_id",
      "status",
      "gas_burnt",
      "tokens_burnt",
      "executed_in_block_timestamp",
      "action_kind as kind",
      "args",
    ])
    .where("executed_in_block_hash", "=", blockHash)
    .where("receipt_kind", "=", "ACTION")
    .orderBy("shard_id")
    .orderBy("execution_outcomes.index_in_chunk")
    .orderBy("index_in_action_receipt")
    .execute();
};

// chunks
export const queryGasUsedInChunks = async (blockHash: string) => {
  return indexerDatabase
    .selectFrom("chunks")
    .select((eb) => sum(eb, "gas_used").as("gas_used"))
    .where("included_in_block_hash", "=", blockHash)
    .executeTakeFirst();
};

export const healthCheck = async () => {
  await sql`select 1`.execute(indexerDatabase);
};
