import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "../../context";
import { RPC } from "../../types";
import * as nearApi from "../../utils/near";
import { validators } from "../validators";
import { indexerDatabase } from "../../database/databases";
import { Action, mapRpcActionToAction } from "../../utils/actions";
import { mapRpcTransactionStatus } from "../../utils/transaction-status";
import {
  mapRpcReceiptStatus,
  ReceiptExecutionStatus,
} from "../../utils/receipt-status";
import { nanosecondsToMilliseconds } from "../../utils/bigint";

type ParsedReceipt = Omit<NestedReceiptWithOutcome, "outcome"> & {
  outcome: Omit<NestedReceiptWithOutcome["outcome"], "nestedReceipts"> & {
    receiptIds: string[];
  };
};

type NestedReceiptWithOutcome = {
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
    nestedReceipts: NestedReceiptWithOutcome[];
  };
};

const collectNestedReceiptWithOutcome = (
  idOrHash: string,
  parsedMap: Map<string, ParsedReceipt>
): NestedReceiptWithOutcome => {
  const parsedElement = parsedMap.get(idOrHash)!;
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

const parseOutcome = (
  outcome: RPC.ExecutionOutcomeWithIdView
): ParsedReceipt["outcome"] => {
  return {
    blockHash: outcome.block_hash,
    tokensBurnt: outcome.outcome.tokens_burnt,
    gasBurnt: outcome.outcome.gas_burnt,
    status: mapRpcReceiptStatus(outcome.outcome.status),
    logs: outcome.outcome.logs,
    receiptIds: outcome.outcome.receipt_ids,
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
            outcome: parseOutcome(receiptOutcome),
          });
        },
        new Map<string, ParsedReceipt>()
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
        receipt: collectNestedReceiptWithOutcome(
          rpcTransaction.transaction_outcome.outcome.receipt_ids[0],
          receiptsMap
        ),
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

      const transactionFee = getTransactionFee(
        rpcTransaction.transaction_outcome,
        rpcTransaction.receipts_outcome
      );

      const txActions =
        rpcTransaction.transaction.actions.map(mapRpcActionToAction);
      const transactionAmount = getDeposit(txActions);

      return {
        hash,
        timestamp: databaseTransaction.timestamp,
        signerId: rpcTransaction.transaction.signer_id,
        receiverId: rpcTransaction.transaction.receiver_id,
        fee: transactionFee.toString(),
        amount: transactionAmount.toString(),
        status: mapRpcTransactionStatus(rpcTransaction.status),
      };
    },
  })
  .query("byReceiptId", {
    input: z.strictObject({ receiptId: validators.receiptId }),
    resolve: async ({ input: { receiptId } }) => {
      const transactionInfo = await indexerDatabase
        .selectFrom("receipts")
        .select([
          "receipt_id as receiptId",
          "originated_from_transaction_hash as transactionHash",
        ])
        .where("receipt_id", "=", receiptId)
        .limit(1)
        .executeTakeFirst();
      return transactionInfo;
    },
  });
