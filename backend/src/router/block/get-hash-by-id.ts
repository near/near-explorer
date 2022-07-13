import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "../../context";
import { validators } from "../validators";
import { indexerDatabase } from "../../database/databases";

export const router = trpc.router<Context>().query("getHashById", {
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
});
