import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "../../context";
import { router as listRouter } from "./list";
import * as transactions from "../../providers/transactions";
import * as receipts from "../../providers/receipts";
import { RPC } from "../../types";
import * as nearApi from "../../utils/near";
import { validators } from "../validators";
import { mapRpcTransactionStatus } from "../../utils/transaction-status";
import { Action, mapRpcActionToAction } from "../../utils/actions";
import {
  mapRpcReceiptStatus,
  ReceiptExecutionStatus,
} from "../../utils/receipt-status";

export const router = trpc
  .router<Context>()
  .query("transaction-info", {
    input: z.tuple([validators.transactionHash]),
    resolve: async ({ input: [transactionHash] }) => {
      const transactionBaseInfo = await transactions.getTransactionInfo(
        transactionHash
      );
      if (!transactionBaseInfo) {
        return null;
      }
      const transactionInfo = await nearApi.sendJsonRpc(
        "EXPERIMENTAL_tx_status",
        [transactionBaseInfo.hash, transactionBaseInfo.signerId]
      );

      const actions =
        transactionInfo.transaction.actions.map(mapRpcActionToAction);
      const receipts = transactionInfo.receipts;
      const receiptsOutcome = transactionInfo.receipts_outcome.map(
        (outcome) => ({
          ...outcome,
          outcome: {
            ...outcome.outcome,
            status: mapRpcReceiptStatus(outcome.outcome.status),
          },
        })
      );
      if (
        receipts.length === 0 ||
        receipts[0].receipt_id !== receiptsOutcome[0].id
      ) {
        receipts.unshift({
          predecessor_id: transactionInfo.transaction.signer_id,
          receipt: {
            Action: {
              signer_id: transactionInfo.transaction.signer_id,
              signer_public_key: "",
              gas_price: "0",
              output_data_receivers: [],
              input_data_ids: [],
              actions: transactionInfo.transaction.actions,
            },
          },
          receipt_id: receiptsOutcome[0].id,
          receiver_id: transactionInfo.transaction.receiver_id,
        });
      }
      const receiptOutcomesByIdMap = new Map<
        string,
        Omit<RPC.ExecutionOutcomeWithIdView, "outcome"> & {
          outcome: Omit<RPC.ExecutionOutcomeView, "status"> & {
            status: ReceiptExecutionStatus;
          };
        }
      >();
      receiptsOutcome.forEach((receipt) => {
        receiptOutcomesByIdMap.set(receipt.id, receipt);
      });

      const receiptsByIdMap = new Map<
        string,
        Omit<RPC.ReceiptView, "actions"> & { actions: Action[] }
      >();
      receipts.forEach((receiptItem) => {
        receiptsByIdMap.set(receiptItem.receipt_id, {
          ...receiptItem,
          actions:
            "Action" in receiptItem.receipt
              ? receiptItem.receipt.Action.actions.map(mapRpcActionToAction)
              : [],
        });
      });

      return {
        ...transactionBaseInfo,
        status: mapRpcTransactionStatus(transactionInfo.status),
        actions,
        receiptsOutcome,
        receipt: transactions.collectNestedReceiptWithOutcome(
          receiptsOutcome[0].id,
          receiptsByIdMap,
          receiptOutcomesByIdMap
        ),
        transactionOutcome: {
          ...transactionInfo.transaction_outcome,
          outcome: {
            ...transactionInfo.transaction_outcome.outcome,
            status: mapRpcReceiptStatus(
              transactionInfo.transaction_outcome.outcome.status
            ),
          },
        },
      };
    },
  })
  .query("transaction", {
    input: z.strictObject({
      hash: validators.transactionHash,
    }),
    resolve: ({ input: { hash } }) => {
      return transactions.getTransactionDetails(hash);
    },
  })
  .query("transaction-hash-by-receipt-id", {
    input: z.tuple([validators.receiptId]),
    resolve: ({ input: [receiptId] }) => {
      return receipts.getReceiptInTransaction(receiptId);
    },
  })
  .query("is-transaction-indexed", {
    input: z.tuple([validators.transactionHash]),
    resolve: ({ input: [transactionHash] }) => {
      return transactions.getIsTransactionIndexed(transactionHash);
    },
  })
  .merge("transaction.", listRouter);
