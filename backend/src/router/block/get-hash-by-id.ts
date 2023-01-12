import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "../../context";
import { validators } from "../validators";
import { indexerDatabase } from "../../database/databases";

export const router = trpc.router<Context>().query("getHashById", {
  input: z.strictObject({
    blockId: z.union([
      z.preprocess((x) => Number(x), validators.blockHeight),
      validators.blockHash,
    ]),
  }),
  resolve: async ({ input: { blockId } }) => {
    let selection = indexerDatabase
      .selectFrom("blocks")
      .select("block_hash as hash");
    if (Number.isNaN(blockId)) {
      return null;
    } else if (typeof blockId === "string") {
      selection = selection.where("block_hash", "=", blockId);
    } else {
      selection = selection.where("block_height", "=", blockId.toString());
    }
    const block = await selection.limit(1).executeTakeFirst();
    if (block) {
      return block.hash;
    }
  },
});
