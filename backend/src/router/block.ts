import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "../context";
import * as nearApi from "../utils/near";
import { validators } from "./validators";
import { indexerDatabase } from "../database/databases";
import { count, div, sum } from "../database/utils";
import { millisecondsToNanoseconds } from "../utils/bigint";

export const router = trpc
  .router<Context>()
  .query("final", {
    input: z.discriminatedUnion("source", [
      z.strictObject({ source: z.literal("rpc") }),
      z.strictObject({ source: z.literal("indexer") }),
    ]),
    resolve: async ({ input: { source } }) => {
      if (source === "rpc") {
        const block = await nearApi.sendJsonRpc("block", { finality: "final" });
        return {
          height: block.header.height,
        };
      } else {
        const block = await indexerDatabase
          .selectFrom("blocks")
          .select("block_height as height")
          .orderBy("block_height", "desc")
          .limit(1)
          .executeTakeFirstOrThrow();
        return block;
      }
    },
  })
  .query("byId", {
    input: z.union([
      z.strictObject({ hash: validators.blockHash }),
      z.strictObject({ height: z.number() }),
    ]),
    resolve: async ({ input }) => {
      const selection = await indexerDatabase
        .selectFrom((eb) => {
          let selection = eb.selectFrom("blocks").select("block_hash");
          if ("hash" in input) {
            selection = selection.where("block_hash", "=", input.hash);
          } else {
            selection = selection.where(
              "block_height",
              "=",
              String(input.height)
            );
          }
          return selection.as("innerblocks");
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
        height: parseInt(selection.height!),
        timestamp: parseInt(selection.timestamp),
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
        transactionsCount: parseInt(selection.transactionsCount),
        gasUsed: gasUsedInChunksSelection?.gasUsed || "0",
        receiptsCount: receiptsCountSelection?.count || 0,
      };
    },
  })
  .query("getHashById", {
    input: z.strictObject({
      blockId: z.union([validators.blockHash, z.string().regex(/^\d+$/)]),
    }),
    resolve: async ({ input: { blockId } }) => {
      let selection = indexerDatabase
        .selectFrom("blocks")
        .select("block_hash as hash");
      if (isNaN(parseInt(blockId))) {
        selection = selection.where("block_hash", "=", blockId);
      } else {
        selection = selection.where("block_height", "=", blockId);
      }
      const block = await selection.limit(1).executeTakeFirst();
      if (block) {
        return block.hash;
      }
    },
  })
  .query("list", {
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
