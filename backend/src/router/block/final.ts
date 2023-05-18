import * as trpc from "@trpc/server";
import { z } from "zod";

import { RequestContext } from "@/backend/context";
import { indexerDatabase } from "@/backend/database/databases";
import * as nearApi from "@/backend/utils/near";

export const router = trpc.router<RequestContext>().query("final", {
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
    }
    const block = await indexerDatabase
      .selectFrom("blocks")
      .select("block_height as height")
      .orderBy("block_height", "desc")
      .limit(1)
      .executeTakeFirstOrThrow();
    return block;
  },
});
