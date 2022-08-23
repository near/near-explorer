import * as trpc from "@trpc/server";
import { SelectQueryBuilder } from "kysely";
import {
  TableExpressionDatabase,
  TableExpressionTables,
} from "kysely/dist/cjs/parser/table-parser";
import { z } from "zod";

import { Context } from "../../context";
import { indexerDatabase } from "../../database/databases";
import { validators } from "../validators";

export const router = trpc.router<Context>().query("getTransactionHash", {
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
