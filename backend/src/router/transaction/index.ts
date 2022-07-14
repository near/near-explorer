import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "../../context";
import { router as listRouter } from "./list";
import * as transactions from "../../providers/transactions";
import * as receipts from "../../providers/receipts";
import { RPC } from "../../types";
import * as nearApi from "../../utils/near";
import { validators } from "../validators";
import { mapRpcActionToAction } from "../../utils/actions";
import { mapRpcTransactionStatus } from "../../utils/transaction-status";

export const router = trpc
  .router<Context>()
  .query("transaction-info", {
    input: z.tuple([validators.transactionHash]),
    resolve: async ({ input: [transactionHash] }) => {
      const databaseTransaction = await transactions.getTransactionInfo(
        transactionHash
      );
      if (!databaseTransaction) {
        return null;
      }
      const rpcTransaction = await nearApi.sendJsonRpc(
        "EXPERIMENTAL_tx_status",
        [databaseTransaction.hash, databaseTransaction.signerId]
      );

      const receipts = rpcTransaction.receipts;
      const receiptsOutcome = rpcTransaction.receipts_outcome;
      if (
        receipts.length === 0 ||
        receipts[0].receipt_id !== receiptsOutcome[0].id
      ) {
        receipts.unshift({
          predecessor_id: rpcTransaction.transaction.signer_id,
          receipt: {
            Action: {
              signer_id: rpcTransaction.transaction.signer_id,
              signer_public_key: "",
              gas_price: "0",
              output_data_receivers: [],
              input_data_ids: [],
              actions: rpcTransaction.transaction.actions,
            },
          },
          receipt_id: receiptsOutcome[0].id,
          receiver_id: rpcTransaction.transaction.receiver_id,
        });
      }
      const receiptOutcomesByIdMap = new Map<
        string,
        RPC.ExecutionOutcomeWithIdView
      >();
      receiptsOutcome.forEach((receipt) => {
        receiptOutcomesByIdMap.set(receipt.id, receipt);
      });

      const receiptsByIdMap = new Map<string, RPC.ReceiptView>();
      receipts.forEach((receipt) => {
        receiptsByIdMap.set(receipt.receipt_id, receipt);
      });

      return {
        hash: transactionHash,
        signerId: rpcTransaction.transaction.signer_id,
        receiverId: rpcTransaction.transaction.receiver_id,
        status: mapRpcTransactionStatus(rpcTransaction.status),
        blockHash: databaseTransaction.blockHash,
        blockTimestamp: databaseTransaction.blockTimestamp,
        actions: rpcTransaction.transaction.actions.map(mapRpcActionToAction),
        receipt: transactions.collectNestedReceiptWithOutcome(
          receiptsOutcome[0].id,
          receiptsByIdMap,
          receiptOutcomesByIdMap
        ),
        outcome: {
          gasBurnt: rpcTransaction.transaction_outcome.outcome.gas_burnt,
          tokensBurnt: rpcTransaction.transaction_outcome.outcome.tokens_burnt,
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
