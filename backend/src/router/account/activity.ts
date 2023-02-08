import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "@explorer/backend/context";
import {
  indexerActivityDatabase,
  indexerDatabase,
} from "@explorer/backend/database/databases";
import { div } from "@explorer/backend/database/utils";
import { validators } from "@explorer/backend/router/validators";
import {
  Action,
  DatabaseAction,
  mapDatabaseActionToAction,
} from "@explorer/backend/utils/actions";
import { nanosecondsToMilliseconds } from "@explorer/backend/utils/bigint";
import {
  mapDatabaseTransactionStatus,
  TransactionStatus,
} from "@explorer/backend/utils/transaction-status";
import { notNullGuard } from "@explorer/common/utils/utils";

type ActivityConnectionActions = {
  parentAction?: AccountActivityAction & ActivityConnection;
  childrenActions?: (AccountActivityAction & ActivityConnection)[];
};

type ActivityConnection = {
  transactionHash: string;
  receiptId?: string;
  sender: string;
  receiver: string;
};

type AccountBatchAction = {
  kind: "batch";
  actions: AccountActivityAction[];
};

type AccountValidatorRewardAction = {
  kind: "validatorReward";
  blockHash: string;
};

type AccountActivityAction =
  | Action
  | AccountValidatorRewardAction
  | AccountBatchAction;

type AccountActivityElement = {
  involvedAccountId: string | null;
  cursor: {
    blockTimestamp: string;
    shardId: number;
    indexInChunk: number;
  };
  timestamp: number;
  direction: "inbound" | "outbound";
  deltaAmount: string;
  action: AccountActivityAction &
    ActivityConnectionActions &
    Omit<ActivityConnection, "sender" | "receiver">;
};

type BasePreview = {
  signerId: string;
  receiverId: string;
  actions: Action[];
};

type TransactionPreview = BasePreview & {
  type: "transaction";
  hash: string;
  status: TransactionStatus;
};

type ReceiptPreview = BasePreview & {
  type: "receipt";
  originatedFromTransactionHash: string;
  receiptId: string;
};

const queryBalanceChanges = async (
  accountId: string,
  limit: number,
  cursor?: z.infer<typeof validators.accountActivityCursor>
) => {
  let selection = indexerActivityDatabase
    .selectFrom("balance_changes")
    .select([
      "involved_account_id as involvedAccountId",
      "block_timestamp as blockTimestamp",
      "shard_id as shardId",
      "index_in_chunk as indexInChunk",
      "transaction_hash as transactionHash",
      "receipt_id as receiptId",
      "direction",
      "cause",
      "status",
      "delta_nonstaked_amount as deltaNonStakedAmount",
    ])
    .where("affected_account_id", "=", accountId)
    // filter out gas rewards
    .where("cause", "<>", "CONTRACT_REWARD")
    // filter out (some) refunds
    .where("involved_account_id", "is not", null)
    .where((qb) =>
      // filter out outbound receipts
      qb.where("receipt_id", "<>", null).orWhere("direction", "=", "INBOUND")
    );
  if (cursor) {
    selection = selection
      .where("block_timestamp", "<=", cursor.blockTimestamp)
      .where("shard_id", "<=", cursor.shardId)
      .where("index_in_chunk", "<=", cursor.indexInChunk)
      .offset(1);
  }
  return selection
    .orderBy("block_timestamp", "desc")
    .orderBy("shard_id", "desc")
    .orderBy("index_in_chunk", "desc")
    .limit(limit)
    .execute();
};

const getIdsFromAccountChanges = (
  changes: Awaited<ReturnType<typeof queryBalanceChanges>>
) =>
  changes.reduce<{
    receiptIds: string[];
    transactionHashes: string[];
    blocksTimestamps: string[];
  }>(
    (acc, change) => {
      switch (change.cause) {
        case "RECEIPT":
          acc.receiptIds.push(change.receiptId!);
          break;
        case "TRANSACTION":
          acc.transactionHashes.push(change.transactionHash!);
          break;
        case "VALIDATORS_REWARD":
          acc.blocksTimestamps.push(change.blockTimestamp);
      }
      return acc;
    },
    {
      receiptIds: [],
      transactionHashes: [],
      blocksTimestamps: [],
    }
  );

const getActivityAction = (actions: Action[]): AccountActivityAction => {
  if (actions.length === 0) {
    throw new Error("Unexpected zero-length array of actions");
  }
  if (actions.length !== 1) {
    return {
      kind: "batch",
      actions: actions.map((action) => getActivityAction([action])),
    };
  }
  return actions[0];
};

const withActivityConnection = <T>(
  input: T,
  source?: TransactionPreview | ReceiptPreview
): T & Pick<ActivityConnection, "transactionHash" | "receiptId"> => {
  if (!source) {
    return {
      ...input,
      transactionHash: "",
    };
  }
  if ("receiptId" in source) {
    return {
      ...input,
      transactionHash: source.originatedFromTransactionHash,
      receiptId: source.receiptId,
    };
  }
  return {
    ...input,
    transactionHash: source.hash,
  };
};

const withConnections = <T>(
  input: T,
  source: ReceiptPreview | TransactionPreview
): T & Pick<ActivityConnection, "sender" | "receiver"> => ({
  ...input,
  sender: source.signerId,
  receiver: source.receiverId,
});

const getAccountActivityAction = (
  change: Awaited<ReturnType<typeof queryBalanceChanges>>[number],
  receiptsMapping: Map<string, ReceiptPreview>,
  transactionsMapping: Map<string, TransactionPreview>,
  blockHeightsMapping: Map<string, { hash: string }>,
  receiptRelations: Map<
    string,
    { parentReceiptId: string | null; childrenReceiptIds: string[] }
  >
): AccountActivityElement["action"] | null => {
  switch (change.cause) {
    case "RECEIPT": {
      const connectedReceipt = receiptsMapping.get(change.receiptId!)!;
      const relation = receiptRelations.get(change.receiptId!)!;
      const parentReceipt = relation.parentReceiptId
        ? receiptsMapping.get(relation.parentReceiptId)!
        : undefined;
      const childrenReceipts = relation.childrenReceiptIds.map(
        (childrenReceiptId) => receiptsMapping.get(childrenReceiptId)!
      );
      return withActivityConnection(
        {
          ...getActivityAction(connectedReceipt.actions),
          parentAction:
            // Refund
            parentReceipt && parentReceipt.signerId !== "system"
              ? withConnections(
                  withActivityConnection(
                    getActivityAction(parentReceipt.actions),
                    parentReceipt
                  ),
                  parentReceipt
                )
              : undefined,
          childrenActions: childrenReceipts
            // Refund
            .filter((receipt) => receipt.signerId !== "system")
            .map((receipt) =>
              withConnections(
                withActivityConnection(
                  getActivityAction(receipt.actions),
                  receipt
                ),
                receipt
              )
            ),
        },
        connectedReceipt
      );
    }
    case "TRANSACTION": {
      const connectedTransaction = transactionsMapping.get(
        change.transactionHash!
      )!;
      // filter out inbound successful transactions
      if (
        connectedTransaction.status === "success" &&
        change.direction === "INBOUND"
      ) {
        return null;
      }
      return withActivityConnection(
        {
          ...getActivityAction(connectedTransaction.actions),
          childrenActions: [],
        },
        connectedTransaction
      );
    }
    case "VALIDATORS_REWARD":
      const connectedBlock = blockHeightsMapping.get(change.blockTimestamp!)!;
      return withActivityConnection({
        kind: "validatorReward",
        blockHash: connectedBlock.hash,
      });
  }
  throw new Error(`Unknown cause: ${change.cause}`);
};

const getBlockHeightsByTimestamps = async (blockTimestamps: string[]) => {
  if (blockTimestamps.length === 0) {
    return new Map();
  }
  const blocks = await indexerDatabase
    .selectFrom("blocks")
    .select(["block_timestamp as timestamp", "block_hash as hash"])
    .where("block_timestamp", "in", blockTimestamps)
    .execute();
  return blocks.reduce(
    (acc, block) => acc.set(block.timestamp, { hash: block.hash }),
    new Map<string, { hash: string }>()
  );
};

const queryReceiptsByIds = async (ids: string[]) =>
  indexerDatabase
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
      "action_receipt_actions.receipt_id as id",
      "originated_from_transaction_hash as originatedFromTransactionHash",
      "predecessor_account_id as predecessorId",
      "receiver_account_id as receiverId",
      "status",
      "executed_in_block_timestamp as blockTimestamp",
      "action_kind as kind",
      "args",
    ])
    .where("action_receipt_actions.receipt_id", "in", ids)
    .where("receipt_kind", "=", "ACTION")
    .execute();

const getReceiptMapping = (
  receiptRows: Awaited<ReturnType<typeof queryReceiptsByIds>>,
  initialMapping: Map<string, ReceiptPreview> = new Map()
) =>
  receiptRows.reduce((mapping, receipt) => {
    const action = mapDatabaseActionToAction({
      hash: receipt.originatedFromTransactionHash,
      kind: receipt.kind,
      args: receipt.args,
    } as DatabaseAction);
    const existingReceipt = mapping.get(receipt.id);
    if (!existingReceipt) {
      return mapping.set(receipt.id, {
        type: "receipt",
        signerId: receipt.predecessorId,
        receiverId: receipt.receiverId,
        receiptId: receipt.id,
        originatedFromTransactionHash: receipt.originatedFromTransactionHash,
        actions: [action],
      });
    }
    return mapping.set(receipt.id, {
      ...existingReceipt,
      actions: [...existingReceipt.actions, action],
    });
  }, new Map<string, ReceiptPreview>(initialMapping));

const getReceiptsByIds = async (
  ids: string[]
): Promise<{
  receiptsMapping: Map<string, ReceiptPreview>;
  relations: Map<
    string,
    { parentReceiptId: string | null; childrenReceiptIds: string[] }
  >;
}> => {
  if (ids.length === 0) {
    return {
      receiptsMapping: new Map(),
      relations: new Map(),
    };
  }
  const receiptsMapping = getReceiptMapping(await queryReceiptsByIds(ids));
  const relatedResult = await indexerDatabase
    .selectFrom("execution_outcome_receipts")
    .select([
      "executed_receipt_id as executedReceiptId",
      "produced_receipt_id as producedReceiptId",
    ])
    .where("executed_receipt_id", "in", ids)
    .orWhere("produced_receipt_id", "in", ids)
    .execute();
  const relations = ids.reduce((acc, id) => {
    const relatedIds: {
      parentReceiptId: string | null;
      childrenReceiptIds: string[];
    } = {
      parentReceiptId: null,
      childrenReceiptIds: [],
    };
    const parentRow = relatedResult.find((row) => row.producedReceiptId === id);
    if (parentRow) {
      relatedIds.parentReceiptId = parentRow.executedReceiptId;
    }
    const childrenRows = relatedResult.filter(
      (row) => row.executedReceiptId === id
    );
    if (childrenRows.length !== 0) {
      relatedIds.childrenReceiptIds = childrenRows.map(
        (row) => row.producedReceiptId
      );
    }
    return acc.set(id, relatedIds);
  }, new Map<string, { parentReceiptId: string | null; childrenReceiptIds: string[] }>());
  const prevReceiptIds = [...receiptsMapping.keys()];
  const lookupIds = [...relations.values()].reduce<Set<string>>(
    (acc, relation) => {
      if (
        relation.parentReceiptId &&
        !prevReceiptIds.includes(relation.parentReceiptId)
      ) {
        acc.add(relation.parentReceiptId);
      }
      const filteredChildrenIds = relation.childrenReceiptIds.filter(
        (id) => !prevReceiptIds.includes(id)
      );
      filteredChildrenIds.forEach((id) => acc.add(id));
      return acc;
    },
    new Set()
  );
  return {
    receiptsMapping: getReceiptMapping(
      await queryReceiptsByIds([...lookupIds]),
      receiptsMapping
    ),
    relations,
  };
};

const getTransactionsByHashes = async (
  hashes: string[]
): Promise<Map<string, TransactionPreview>> => {
  if (hashes.length === 0) {
    return new Map();
  }
  const transactionRows = await indexerDatabase
    .selectFrom("transactions")
    .select([
      "transaction_hash as hash",
      "signer_account_id as signerId",
      "receiver_account_id as receiverId",
      "included_in_block_hash as blockHash",
      (eb) => div(eb, "block_timestamp", 1000 * 1000, "blockTimestamp"),
      "index_in_chunk as transactionIndex",
      "status",
    ])
    .where("transaction_hash", "in", hashes)
    .execute();
  if (transactionRows.length === 0) {
    return new Map();
  }
  const transactionsActions = await indexerDatabase
    .selectFrom("transaction_actions")
    .select(["transaction_hash as hash", "action_kind as kind", "args"])
    .where(
      "transaction_hash",
      "in",
      transactionRows.map(({ hash }) => hash)
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
  return transactionRows.reduce((acc, transaction) => {
    acc.set(transaction.hash, {
      type: "transaction",
      hash: transaction.hash,
      signerId: transaction.signerId,
      receiverId: transaction.receiverId,
      status: mapDatabaseTransactionStatus(transaction.status),
      actions: transactionsActionsList.get(transaction.hash) ?? [],
    });
    return acc;
  }, new Map<string, TransactionPreview>());
};

export const router = trpc.router<Context>().query("activity", {
  input: z.strictObject({
    accountId: validators.accountId,
    limit: validators.limit,
    cursor: validators.accountActivityCursor.optional(),
  }),
  resolve: async ({ input }) => {
    const changes = await queryBalanceChanges(
      input.accountId,
      input.limit,
      input.cursor
    );

    const idsToFetch = getIdsFromAccountChanges(changes);
    const [
      { receiptsMapping, relations: receiptRelations },
      transactionsMapping,
      blocksMapping,
    ] = await Promise.all([
      getReceiptsByIds(idsToFetch.receiptIds),
      getTransactionsByHashes(idsToFetch.transactionHashes),
      getBlockHeightsByTimestamps(idsToFetch.blocksTimestamps),
    ]);
    const lastChange = changes.at(-1);
    return {
      items: changes
        .map((change) => {
          const action = getAccountActivityAction(
            change,
            receiptsMapping,
            transactionsMapping,
            blocksMapping,
            receiptRelations
          );
          if (!action) {
            return null;
          }
          return {
            timestamp: nanosecondsToMilliseconds(BigInt(change.blockTimestamp)),
            involvedAccountId: change.involvedAccountId!,
            direction: change.direction === "INBOUND" ? "inbound" : "outbound",
            deltaAmount: change.deltaNonStakedAmount,
            action,
          };
        })
        .filter(notNullGuard),
      cursor: lastChange
        ? {
            blockTimestamp: lastChange.blockTimestamp,
            shardId: lastChange.shardId,
            indexInChunk: lastChange.indexInChunk,
          }
        : undefined,
    };
  },
});
