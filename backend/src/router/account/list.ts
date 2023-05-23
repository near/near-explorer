import { z } from "zod";

import { indexerDatabase } from "@/backend/database/databases";
import { div } from "@/backend/database/utils";
import { t } from "@/backend/router/trpc";
import { validators } from "@/backend/router/validators";

export const procedure = t.procedure
  .input(
    z.strictObject({
      limit: validators.limit,
      cursor: validators.accountPagination.nullish(),
    })
  )
  .query(async ({ input: { limit, cursor } }) => {
    let selection = indexerDatabase
      .selectFrom("accounts")
      .leftJoin("receipts as creationReceipt", (jb) =>
        jb.onRef(
          "creationReceipt.receipt_id",
          "=",
          "accounts.created_by_receipt_id"
        )
      )
      .leftJoin("receipts as deletionReceipt", (jb) =>
        jb.onRef(
          "deletionReceipt.receipt_id",
          "=",
          "accounts.deleted_by_receipt_id"
        )
      )
      .select([
        "account_id as id",
        "id as index",
        (eb) =>
          div(
            eb,
            "creationReceipt.included_in_block_timestamp",
            1000 * 1000,
            "createdTimestamp"
          ),
        (eb) =>
          div(
            eb,
            "deletionReceipt.included_in_block_timestamp",
            1000 * 1000,
            "deletedTimestamp"
          ),
      ]);
    if (cursor) {
      selection = selection.where("id", "<", cursor.index.toString());
    }
    const accountsList = await selection
      .orderBy("index", "desc")
      .limit(limit)
      .execute();
    return accountsList.map((account) => ({
      id: account.id,
      index: parseInt(account.index, 10),
      createdTimestamp: account.createdTimestamp
        ? parseInt(account.createdTimestamp, 10)
        : undefined,
      deletedTimestamp: account.deletedTimestamp
        ? parseInt(account.deletedTimestamp, 10)
        : undefined,
    }));
  });
