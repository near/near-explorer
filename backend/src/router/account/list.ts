import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "../../context";
import { indexerDatabase } from "../../database/databases";
import { validators } from "../validators";

export const router = trpc.router<Context>().query("listByTimestamp", {
  input: z.strictObject({
    limit: validators.limit,
    cursor: validators.accountPagination.optional(),
  }),
  resolve: async ({ input: { limit, cursor } }) => {
    let selection = indexerDatabase
      .selectFrom("accounts")
      .select(["account_id as accountId", "id as accountIndex"])
      .leftJoin("receipts", (jb) =>
        jb.onRef("receipt_id", "=", "created_by_receipt_id")
      );
    if (cursor !== undefined) {
      selection = selection.where("id", "<", cursor.toString());
    }
    const accountsList = await selection
      .orderBy("accountIndex", "desc")
      .limit(limit)
      .execute();
    return accountsList.map((account) => ({
      accountId: account.accountId,
      accountIndex: parseInt(account.accountIndex),
    }));
  },
});
