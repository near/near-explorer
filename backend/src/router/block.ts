import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "../context";
import * as nearApi from "../utils/near";
import * as blocks from "../providers/blocks";
import * as chunks from "../providers/chunks";
import * as receipts from "../providers/receipts";
import { validators } from "./validators";

export const router = trpc
  .router<Context>()
  .query("nearcore-final-block", {
    resolve: () => {
      return nearApi.sendJsonRpc("block", { finality: "final" });
    },
  })
  .query("block-info", {
    input: z.tuple([validators.blockId]),
    resolve: async ({ input: [blockId] }) => {
      const block = await blocks.getBlockInfo(blockId);
      if (!block) {
        return null;
      }
      const receiptsCount = await receipts.getReceiptsCountInBlock(block?.hash);
      const gasUsedInChunks = await chunks.getGasUsedInChunks(block?.hash);
      return {
        ...block,
        gasUsed: gasUsedInChunks || "0",
        receiptsCount: receiptsCount || 0,
      };
    },
  })
  .query("block-by-hash-or-id", {
    input: z.tuple([validators.blockId]),
    resolve: ({ input: [blockId] }) => {
      return blocks.getBlockByHashOrId(blockId);
    },
  })
  .query("blocks-list", {
    input: z.strictObject({
      limit: validators.limit,
      cursor: validators.blockPagination.optional(),
    }),
    resolve: ({ input: { limit, cursor } }) => {
      return blocks.getBlocksList(limit, cursor);
    },
  });
