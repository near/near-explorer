import * as trpc from "@trpc/server";
import { z } from "zod";

import { RequestContext } from "@explorer/backend/context";
import { indexerDatabase } from "@explorer/backend/database/databases";
import { validators } from "@explorer/backend/router/validators";

export const router = trpc
  .router<RequestContext>()
  .query("getTransactionHash", {
    input: z.strictObject({ id: validators.receiptId }),
    resolve: async ({ input: { id } }) => {
      const row = await indexerDatabase
        .selectFrom("receipts")
        .where("receipts.receipt_id", "=", id)
        .select("originated_from_transaction_hash as transactionHash")
        .executeTakeFirst();
      if (!row) {
        return null;
      }
      return row.transactionHash;
    },
  });
