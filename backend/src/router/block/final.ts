import { z } from "zod";

import { indexerDatabase } from "@/backend/database/databases";
import { commonProcedure } from "@/backend/router/trpc";
import * as nearApi from "@/backend/utils/near";

export const procedure = commonProcedure
  .input(
    z.discriminatedUnion("source", [
      z.strictObject({ source: z.literal("rpc") }),
      z.strictObject({ source: z.literal("indexer") }),
    ])
  )
  .query(async ({ input: { source } }) => {
    if (source === "rpc") {
      const block = await nearApi.sendJsonRpc("block", { finality: "final" });
      return {
        height: block.header.height,
      };
    }
    const block = await indexerDatabase
      .selectFrom("blocks")
      .select("block_height as height")
      .orderBy("block_height", "desc")
      .limit(1)
      .executeTakeFirstOrThrow();
    return block;
  });
