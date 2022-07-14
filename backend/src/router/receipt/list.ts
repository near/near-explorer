import * as trpc from "@trpc/server";
import { SelectQueryBuilder } from "kysely";
import {
  TableExpressionDatabase,
  TableExpressionTables,
} from "kysely/dist/cjs/parser/table-parser";
import { z } from "zod";

import { Context } from "../../context";
import { Indexer, indexerDatabase } from "../../database/databases";
import {
  Action,
  DatabaseAction,
  mapDatabaseActionToAction,
} from "../../utils/actions";
import {
  mapDatabaseReceiptStatus,
  ReceiptExecutionStatus,
} from "../../utils/receipt-status";
import { nanosecondsToMilliseconds } from "../../utils/bigint";
import { validators } from "../validators";

type ActionReceiptsActionDatabaseExpression = TableExpressionDatabase<
  Indexer.ModelTypeMap,
  "action_receipt_actions"
>;

type WithReceiptsDatabaseExpression = TableExpressionDatabase<
  ActionReceiptsActionDatabaseExpression,
  "receipts"
>;

type WithExecutionOutcomesDatabaseExpression = SelectQueryBuilder<
  TableExpressionDatabase<WithReceiptsDatabaseExpression, "execution_outcomes">,
  TableExpressionTables<
    WithReceiptsDatabaseExpression,
    TableExpressionTables<
      ActionReceiptsActionDatabaseExpression,
      "action_receipt_actions",
      "receipts"
    >,
    "execution_outcomes"
  >,
  {}
>;

const getReceiptActions = async (
  handler: (
    expr: WithExecutionOutcomesDatabaseExpression
  ) => WithExecutionOutcomesDatabaseExpression
) => {
  let selection = indexerDatabase
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
    );
  selection = handler(selection);
  return selection
    .where("receipt_kind", "=", "ACTION")
    .select([
      "receipts.receipt_id as receiptId",
      "originated_from_transaction_hash as hash",
      "predecessor_account_id as predecessorId",
      "receiver_account_id as receiverId",
      "status",
      "gas_burnt as gasBurnt",
      "tokens_burnt as tokensBurnt",
      "executed_in_block_timestamp as timestamp",
      "action_kind as kind",
      "args",
    ])
    .orderBy("execution_outcomes.index_in_chunk")
    .orderBy("action_receipt_actions.index_in_action_receipt")
    .execute();
};

type Receipt = {
  actions: Action[];
  blockTimestamp: number;
  id: string;
  gasBurnt: string;
  receiverId: string;
  signerId: string;
  status: ReceiptExecutionStatus["type"];
  originatedFromTransactionHash: string;
  tokensBurnt: string;
};

const groupReceiptActionsIntoReceipts = (
  receiptActions: Awaited<ReturnType<typeof getReceiptActions>>
): Receipt[] => {
  // The receipt actions are ordered in such a way that the actions for a single receipt go
  // one after another in a correct order, so we can collect them linearly using a moving
  // window based on the `previousReceiptId`.
  return receiptActions.reduce<Receipt[]>((acc, action) => {
    const lastReceipt = acc[acc.length - 1];
    if (!lastReceipt || lastReceipt.id !== action.receiptId) {
      acc.push({
        actions: [],
        blockTimestamp: nanosecondsToMilliseconds(BigInt(action.timestamp)),
        gasBurnt: action.gasBurnt,
        id: action.receiptId,
        receiverId: action.receiverId,
        signerId: action.predecessorId,
        status: mapDatabaseReceiptStatus(action.status),
        originatedFromTransactionHash: action.hash,
        tokensBurnt: action.tokensBurnt,
      });
    }
    acc[acc.length - 1].actions.push(
      mapDatabaseActionToAction(action as DatabaseAction)
    );
    return acc;
  }, []);
};

export const router = trpc
  .router<Context>()
  // As a temporary solution we split receipts list into two lists:
  // included in block and executed in block
  // more info here https://github.com/near/near-explorer/pull/868
  .query("listIncludedByBlockHash", {
    input: z.strictObject({ blockHash: validators.blockHash }),
    resolve: async ({ input: { blockHash } }) => {
      const receiptActions = await getReceiptActions((selection) =>
        selection
          .orderBy("included_in_block_hash")
          .where("included_in_block_hash", "=", blockHash)
      );
      return groupReceiptActionsIntoReceipts(receiptActions);
    },
  })
  .query("listExecutedByBlockHash", {
    input: z.strictObject({ blockHash: validators.blockHash }),
    resolve: async ({ input: { blockHash } }) => {
      const receiptActions = await getReceiptActions((selection) =>
        selection
          .orderBy("execution_outcomes.shard_id")
          .where("executed_in_block_hash", "=", blockHash)
      );
      return groupReceiptActionsIntoReceipts(receiptActions);
    },
  });
