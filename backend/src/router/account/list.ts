import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "@explorer/backend/context";
import { indexerDatabase } from "@explorer/backend/database/databases";
import { validators } from "@explorer/backend/router/validators";

export const router = trpc.router<Context>().query("listByTimestamp", {
  input: z.strictObject({
    limit: validators.limit,
    cursor: validators.accountPagination.nullish(),
  }),
  resolve: async ({ input: { limit, cursor } }) => {
    let selection = indexerDatabase
      .selectFrom("accounts")
      .select(["account_id as accountId", "id as accountIndex"])
      .leftJoin("receipts", (jb) =>
        jb.onRef("receipt_id", "=", "created_by_receipt_id")
      );
    if (cursor) {
      selection = selection.where("id", "<", cursor.index.toString());
    }
    const accountsList = await selection
      .orderBy("accountIndex", "desc")
      .limit(limit)
      .execute();
    return accountsList.map((account) => ({
      accountId: account.accountId,
      accountIndex: parseInt(account.accountIndex, 10),
    }));
  },
});
