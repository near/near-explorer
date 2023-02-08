import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "@explorer/backend/context";
import { indexerDatabase } from "@explorer/backend/database/databases";
import { count, div } from "@explorer/backend/database/utils";
import { validators } from "@explorer/backend/router/validators";
import { millisecondsToNanoseconds } from "@explorer/backend/utils/bigint";

export const router = trpc.router<Context>().query("list", {
  input: z.strictObject({
    limit: validators.limit,
    cursor: validators.blockPagination.optional(),
  }),
  resolve: async ({ input: { limit, cursor } }) => {
    const selection = await indexerDatabase
      .selectFrom((eb) => {
        let selection = eb.selectFrom("blocks").select("block_hash");
        if (cursor !== undefined) {
          selection = selection.where(
            "block_timestamp",
            "<",
            millisecondsToNanoseconds(cursor).toString()
          );
        }
        return selection
          .orderBy("block_height", "desc")
          .limit(limit)
          .as("innerblocks");
      })
      .leftJoin("transactions", (jb) =>
        jb.onRef(
          "transactions.included_in_block_hash",
          "=",
          "innerblocks.block_hash"
        )
      )
      .leftJoin("blocks", (jb) =>
        jb.onRef("blocks.block_hash", "=", "innerblocks.block_hash")
      )
      .select([
        "blocks.block_hash as hash",
        "block_height as height",
        (eb) => div(eb, "blocks.block_timestamp", 1000 * 1000, "timestamp"),
        "prev_block_hash as prevHash",
        (eb) => count(eb, "transaction_hash").as("transactionsCount"),
      ])
      .groupBy("blocks.block_hash")
      .orderBy("blocks.block_timestamp", "desc")
      .execute();
    return selection.map((selectionRow) => ({
      // TODO: Discover how to get rid of non-null type assertion
      hash: selectionRow.hash!,
      // TODO: Discover how to get rid of non-null type assertion
      height: parseInt(selectionRow.height!),
      timestamp: parseInt(selectionRow.timestamp),
      // TODO: Discover how to get rid of non-null type assertion
      prevHash: selectionRow.prevHash!,
      transactionsCount: parseInt(selectionRow.transactionsCount),
    }));
  },
});
