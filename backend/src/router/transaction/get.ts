import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "@explorer/backend/context";
import * as RPC from "@explorer/common/types/rpc";
import * as nearApi from "@explorer/backend/utils/near";
import { validators } from "@explorer/backend/router/validators";
import {
  indexerActivityDatabase,
  indexerDatabase,
} from "@explorer/backend/database/databases";
import { Action, mapRpcActionToAction } from "@explorer/backend/utils/actions";
import { mapRpcTransactionStatus } from "@explorer/backend/utils/transaction-status";
import {
  mapRpcReceiptStatus,
  ReceiptExecutionStatus,
} from "@explorer/backend/utils/receipt-status";
import { nanosecondsToMilliseconds } from "@explorer/backend/utils/bigint";
import { div } from "@explorer/backend/database/utils";

type ParsedReceiptOld = Omit<NestedReceiptWithOutcomeOld, "outcome"> & {
  outcome: Omit<NestedReceiptWithOutcomeOld["outcome"], "nestedReceipts"> & {
    receiptIds: string[];
  };
};

type FailedToFindReceipt = { id: string };

type NestedReceiptWithOutcomeOld = {
  id: string;
  predecessorId: string;
  receiverId: string;
  actions: Action[];
  outcome: {
    blockHash: string;
    tokensBurnt: string;
    gasBurnt: number;
    status: ReceiptExecutionStatus;
    logs: string[];
    nestedReceipts: (NestedReceiptWithOutcomeOld | FailedToFindReceipt)[];
  };
};

const collectNestedReceiptWithOutcomeOld = (
  idOrHash: string,
  parsedMap: Map<string, ParsedReceiptOld>
): NestedReceiptWithOutcomeOld | FailedToFindReceipt => {
  const parsedElement = parsedMap.get(idOrHash)!;
  if (!parsedElement) {
    return { id: idOrHash };
  }
  const { receiptIds, ...restOutcome } = parsedElement.outcome;
  return {
    ...parsedElement,
    outcome: {
      ...restOutcome,
      nestedReceipts: receiptIds.map((id) =>
        collectNestedReceiptWithOutcomeOld(id, parsedMap)
      ),
    },
  };
};

type NestedReceiptWithOutcome = Omit<NestedReceiptWithOutcomeOld, "outcome"> & {
  outcome: Omit<
    NestedReceiptWithOutcomeOld["outcome"],
    "nestedReceipts" | "blockHash"
  > & {
    block: {
      hash: string;
      height: number;
      timestamp: number;
    };
    nestedReceipts: (NestedReceiptWithOutcome | FailedToFindReceipt)[];
  };
};

type ParsedReceipt = Omit<NestedReceiptWithOutcome, "outcome"> & {
  outcome: Omit<NestedReceiptWithOutcome["outcome"], "nestedReceipts"> & {
    receiptIds: string[];
  };
};

type ParsedBlock = {
  hash: string;
  height: number;
  timestamp: number;
};

const collectNestedReceiptWithOutcome = (
  idOrHash: string,
  parsedMap: Map<string, ParsedReceipt>
): NestedReceiptWithOutcome | FailedToFindReceipt => {
  const parsedElement = parsedMap.get(idOrHash)!;
  if (!parsedElement) {
    return { id: idOrHash };
  }
  const { receiptIds, ...restOutcome } = parsedElement.outcome;
  return {
    ...parsedElement,
    outcome: {
      ...restOutcome,
      nestedReceipts: receiptIds.map((id) =>
        collectNestedReceiptWithOutcome(id, parsedMap)
      ),
    },
  };
};

const getDeposit = (actions: Action[]) =>
  actions
    .map((action) =>
      "deposit" in action.args ? BigInt(action.args.deposit) : 0n
    )
    .reduce((accumulator, deposit) => accumulator + deposit, 0n);

const getTransactionFee = (
  transactionOutcome: RPC.ExecutionOutcomeWithIdView,
  receiptsOutcome: RPC.ExecutionOutcomeWithIdView[]
) =>
  receiptsOutcome
    .map((receipt) => BigInt(receipt.outcome.tokens_burnt))
    .reduce(
      (tokenBurnt, currentFee) => tokenBurnt + currentFee,
      BigInt(transactionOutcome.outcome.tokens_burnt)
    );

const parseReceipt = (
  receipt: RPC.ReceiptView | undefined,
  outcome: RPC.ExecutionOutcomeWithIdView,
  transaction: RPC.SignedTransactionView
): Omit<ParsedReceipt, "outcome"> => {
  if (!receipt) {
    return {
      id: outcome.id,
      predecessorId: transaction.signer_id,
      receiverId: transaction.receiver_id,
      actions: transaction.actions.map(mapRpcActionToAction),
    };
  }
  return {
    id: receipt.receipt_id,
    predecessorId: receipt.predecessor_id,
    receiverId: receipt.receiver_id,
    actions:
      "Action" in receipt.receipt
        ? receipt.receipt.Action.actions.map(mapRpcActionToAction)
        : [],
  };
};

const parseOutcomeOld = (
  outcome: RPC.ExecutionOutcomeWithIdView
): ParsedReceiptOld["outcome"] => {
  return {
    blockHash: outcome.block_hash,
    tokensBurnt: outcome.outcome.tokens_burnt,
    gasBurnt: outcome.outcome.gas_burnt,
    status: mapRpcReceiptStatus(outcome.outcome.status),
    logs: outcome.outcome.logs,
    receiptIds: outcome.outcome.receipt_ids,
  };
};

const parseOutcome = (
  outcome: RPC.ExecutionOutcomeWithIdView,
  blocksMap: Map<string, ParsedBlock>
): ParsedReceipt["outcome"] => {
  const { blockHash, ...oldParsedOutcome } = parseOutcomeOld(outcome);
  return {
    ...oldParsedOutcome,
    block: blocksMap.get(blockHash)!,
  };
};

export const router = trpc
  .router<Context>()
  .query("byHashOld", {
    input: z.strictObject({
      hash: validators.transactionHash,
    }),
    resolve: async ({ input: { hash } }) => {
      const databaseTransaction = await indexerDatabase
        .selectFrom("transactions")
        .select([
          "signer_account_id as signerId",
          "included_in_block_hash as blockHash",
          "block_timestamp as timestamp",
        ])
        .where("transaction_hash", "=", hash)
        .executeTakeFirst();
      if (!databaseTransaction) {
        return null;
      }
      const rpcTransaction = await nearApi.sendJsonRpc(
        "EXPERIMENTAL_tx_status",
        [hash, databaseTransaction.signerId]
      );

      const receiptsMap = rpcTransaction.receipts_outcome.reduce(
        (mapping, receiptOutcome) => {
          const receipt = parseReceipt(
            rpcTransaction.receipts.find(
              (receipt) => receipt.receipt_id === receiptOutcome.id
            ),
            receiptOutcome,
            rpcTransaction.transaction
          );
          return mapping.set(receiptOutcome.id, {
            ...receipt,
            outcome: parseOutcomeOld(receiptOutcome),
          });
        },
        new Map<string, ParsedReceiptOld>()
      );

      return {
        hash: rpcTransaction.transaction.hash,
        signerId: rpcTransaction.transaction.signer_id,
        receiverId: rpcTransaction.transaction.receiver_id,
        blockHash: databaseTransaction.blockHash,
        blockTimestamp: nanosecondsToMilliseconds(
          BigInt(databaseTransaction.timestamp)
        ),
        actions: rpcTransaction.transaction.actions.map((action) =>
          mapRpcActionToAction(action)
        ),
        status: mapRpcTransactionStatus(rpcTransaction.status),
        receipt: collectNestedReceiptWithOutcomeOld(
          rpcTransaction.transaction_outcome.outcome.receipt_ids[0],
          receiptsMap
        ) as NestedReceiptWithOutcomeOld,
        outcome: {
          gasBurnt: rpcTransaction.transaction_outcome.outcome.gas_burnt,
          tokensBurnt: rpcTransaction.transaction_outcome.outcome.tokens_burnt,
        },
      };
    },
  })
  .query("byHash", {
    input: z.strictObject({
      hash: validators.transactionHash,
    }),
    resolve: async ({ input: { hash } }) => {
      const databaseTransaction = await indexerDatabase
        .selectFrom("transactions")
        .select([
          "signer_account_id as signerId",
          (eb) => div(eb, "block_timestamp", 1000 * 1000, "timestamp"),
        ])
        .where("transaction_hash", "=", hash)
        .executeTakeFirst();
      if (!databaseTransaction) {
        return null;
      }
      const rpcTransaction = await nearApi.sendJsonRpc(
        "EXPERIMENTAL_tx_status",
        [hash, databaseTransaction.signerId]
      );
      const blocks = await indexerDatabase
        .selectFrom("blocks")
        .select([
          "block_height as height",
          "block_hash as hash",
          (eb) => div(eb, "block_timestamp", 1000 * 1000, "timestamp"),
        ])
        .where(
          "block_hash",
          "in",
          rpcTransaction.receipts_outcome.map((outcome) => outcome.block_hash)
        )
        .execute();
      const blocksMap = blocks.reduce(
        (map, row) =>
          map.set(row.hash, {
            hash: row.hash,
            height: parseInt(row.height),
            timestamp: parseInt(row.timestamp),
          }),
        new Map<string, ParsedBlock>()
      );

      const transactionFee = getTransactionFee(
        rpcTransaction.transaction_outcome,
        rpcTransaction.receipts_outcome
      );

      const txActions =
        rpcTransaction.transaction.actions.map(mapRpcActionToAction);
      const transactionAmount = getDeposit(txActions);

      const receiptsMap = rpcTransaction.receipts_outcome.reduce(
        (mapping, receiptOutcome) => {
          const receipt = parseReceipt(
            rpcTransaction.receipts.find(
              (receipt) => receipt.receipt_id === receiptOutcome.id
            ),
            receiptOutcome,
            rpcTransaction.transaction
          );
          return mapping.set(receiptOutcome.id, {
            ...receipt,
            outcome: parseOutcome(receiptOutcome, blocksMap),
          });
        },
        new Map<string, ParsedReceipt>()
      );

      return {
        hash,
        timestamp: parseInt(databaseTransaction.timestamp),
        signerId: rpcTransaction.transaction.signer_id,
        receiverId: rpcTransaction.transaction.receiver_id,
        fee: transactionFee.toString(),
        amount: transactionAmount.toString(),
        status: mapRpcTransactionStatus(rpcTransaction.status),
        receipt: collectNestedReceiptWithOutcome(
          rpcTransaction.transaction_outcome.outcome.receipt_ids[0],
          receiptsMap
        ) as NestedReceiptWithOutcome,
      };
    },
  })
  .query("accountBalanceChange", {
    input: z.strictObject({
      accountId: validators.accountId,
      receiptId: validators.receiptId,
    }),
    resolve: async ({ input: { accountId, receiptId } }) => {
      const balanceChanges = await indexerActivityDatabase
        .selectFrom("balance_changes")
        .select(["absolute_nonstaked_amount as absoluteNonStakedAmount"])
        .where("affected_account_id", "=", accountId)
        .where("receipt_id", "=", receiptId)
        .orderBy("index_in_chunk", "desc")
        .limit(1)
        .executeTakeFirst();
      if (!balanceChanges) {
        return null;
      }
      return balanceChanges.absoluteNonStakedAmount;
    },
  });
