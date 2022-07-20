import * as trpc from "@trpc/server";

import { Context } from "../../context";
import { indexerDatabase } from "../../database/databases";

export const router = trpc.router<Context>().query("latestCirculatingSupply", {
  resolve: async () => {
    const selection = await indexerDatabase
      .selectFrom("aggregated__circulating_supply")
      .select([
        "circulating_tokens_supply as supply",
        "computed_at_block_timestamp as timestamp",
      ])
      .orderBy("computed_at_block_timestamp", "desc")
      .limit(1)
      .executeTakeFirstOrThrow();
    return selection;
  },
});
