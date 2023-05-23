import { z } from "zod";

import { indexerDatabase } from "@/backend/database/databases";
import { t } from "@/backend/router/trpc";
import { validators } from "@/backend/router/validators";

export const procedure = t.procedure
  .input(z.strictObject({ id: validators.receiptId }))
  .query(async ({ input: { id } }) => {
    const row = await indexerDatabase
      .selectFrom("receipts")
      .where("receipts.receipt_id", "=", id)
      .select("originated_from_transaction_hash as transactionHash")
      .executeTakeFirst();
    if (!row) {
      return null;
    }
    return row.transactionHash;
  });
