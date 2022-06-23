import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "../context";
import * as transactions from "../providers/transactions";
import * as receipts from "../providers/receipts";
import { KeysOfUnion, RPC } from "../types";
import * as nearApi from "../utils/near";
import { validators } from "./validators";

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

      const actions = transactionInfo.transaction.actions.map(
        transactions.mapRpcActionToAction
      );
      const receipts = transactionInfo.receipts;
      const receiptsOutcome = transactionInfo.receipts_outcome;
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
        RPC.ExecutionOutcomeWithIdView
      >();
      receiptsOutcome.forEach((receipt) => {
        receiptOutcomesByIdMap.set(receipt.id, receipt);
      });

      const receiptsByIdMap = new Map<
        string,
        Omit<RPC.ReceiptView, "actions"> & { actions: transactions.Action[] }
      >();
      receipts.forEach((receiptItem) => {
        receiptsByIdMap.set(receiptItem.receipt_id, {
          ...receiptItem,
          actions:
            "Action" in receiptItem.receipt
              ? receiptItem.receipt.Action.actions.map(
                  transactions.mapRpcActionToAction
                )
              : [],
        });
      });

      return {
        ...transactionBaseInfo,
        status: Object.keys(
          transactionInfo.status
        )[0] as KeysOfUnion<RPC.FinalExecutionStatus>,
        actions,
        receiptsOutcome,
        receipt: transactions.collectNestedReceiptWithOutcome(
          receiptsOutcome[0].id,
          receiptsByIdMap,
          receiptOutcomesByIdMap
        ),
        transactionOutcome: transactionInfo.transaction_outcome,
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
  .query("transaction-execution-status", {
    input: z.tuple([validators.transactionHash, validators.accountId]),
    resolve: async ({ input: [hash, signerId] }) => {
      const transaction = await nearApi.sendJsonRpc("EXPERIMENTAL_tx_status", [
        hash,
        signerId,
      ]);
      return Object.keys(
        transaction.status
      )[0] as KeysOfUnion<RPC.FinalExecutionStatus>;
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
  .query("transactions-list", {
    input: z.strictObject({
      limit: validators.limit,
      cursor: validators.transactionPagination.optional(),
    }),
    resolve: ({ input: { limit, cursor } }) => {
      return transactions.getTransactionsList(limit, cursor);
    },
  })
  .query("transactions-list-by-account-id", {
    input: z.strictObject({
      accountId: validators.accountId,
      limit: validators.limit,
      cursor: validators.transactionPagination.optional(),
    }),
    resolve: ({ input: { accountId, limit, cursor } }) => {
      return transactions.getAccountTransactionsList(accountId, limit, cursor);
    },
  })
  .query("transactions-list-by-block-hash", {
    input: z.strictObject({
      blockHash: validators.blockHash,
      limit: validators.limit,
      cursor: validators.transactionPagination.optional(),
    }),
    resolve: ({ input: { blockHash, limit, cursor } }) => {
      return transactions.getTransactionsListInBlock(blockHash, limit, cursor);
    },
  });
