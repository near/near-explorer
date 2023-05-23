import { z } from "zod";

import { indexerDatabase } from "@/backend/database/databases";
import { count, div, sum } from "@/backend/database/utils";
import { t } from "@/backend/router/trpc";
import { validators } from "@/backend/router/validators";

export const procedure = t.procedure
  .input(
    z.union([
      z.strictObject({ hash: validators.blockHash }),
      z.strictObject({ height: validators.blockHeight }),
    ])
  )
  .query(async ({ input }) => {
    const selection = await indexerDatabase
      .selectFrom((eb) => {
        let innerSelection = eb.selectFrom("blocks").select("block_hash");
        if ("hash" in input) {
          innerSelection = innerSelection.where("block_hash", "=", input.hash);
        } else {
          innerSelection = innerSelection.where(
            "block_height",
            "=",
            String(input.height)
          );
        }
        return innerSelection.as("innerblocks");
      })
      .leftJoin("transactions", (jb) =>
        jb.onRef("included_in_block_hash", "=", "innerblocks.block_hash")
      )
      .leftJoin("blocks", (jb) =>
        jb.onRef("blocks.block_hash", "=", "innerblocks.block_hash")
      )
      .select([
        "blocks.block_hash as hash",
        "block_height as height",
        (eb) => div(eb, "blocks.block_timestamp", 1000 * 1000, "timestamp"),
        "prev_block_hash as prevHash",
        "gas_price as gasPrice",
        "total_supply as totalSupply",
        "author_account_id as authorAccountId",
        (eb) => count(eb, "transaction_hash").as("transactionsCount"),
      ])
      .groupBy("blocks.block_hash")
      .orderBy("blocks.block_timestamp", "desc")
      .limit(1)
      .executeTakeFirst();
    if (!selection || !selection.hash) {
      return null;
    }
    const [receiptsCountSelection, gasUsedInChunksSelection] =
      await Promise.all([
        indexerDatabase
          .selectFrom("receipts")
          .select((eb) => count(eb, "receipt_id").as("count"))
          .where("included_in_block_hash", "=", selection.hash)
          .where("receipt_kind", "=", "ACTION")
          .executeTakeFirst(),
        indexerDatabase
          .selectFrom("chunks")
          .select((eb) => sum(eb, "gas_used").as("gasUsed"))
          .where("included_in_block_hash", "=", selection.hash)
          .executeTakeFirst(),
      ]);
    return {
      // TODO: Discover how to get rid of non-null type assertion
      hash: selection.hash!,
      // TODO: Discover how to get rid of non-null type assertion
      height: parseInt(selection.height!, 10),
      timestamp: parseInt(selection.timestamp, 10),
      // TODO: Discover how to get rid of non-null type assertion
      prevHash: selection.prevHash!,
      // TODO: Discover how to get rid of non-null type assertion
      gasPrice: selection.gasPrice!,
      // TODO: Discover how to get rid of non-null type assertion
      // TODO: Remove totalSupply whenever `epochStartBlock` will be served
      // via different query or subscription, used only there.
      totalSupply: selection.totalSupply!,
      // TODO: Discover how to get rid of non-null type assertion
      authorAccountId: selection.authorAccountId!,
      transactionsCount: parseInt(selection.transactionsCount, 10),
      gasUsed: gasUsedInChunksSelection?.gasUsed || "0",
      receiptsCount: receiptsCountSelection?.count || 0,
    };
  });
