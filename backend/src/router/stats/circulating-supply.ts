import * as trpc from "@trpc/server";

import { RequestContext } from "@explorer/backend/context";
import { indexerDatabase } from "@explorer/backend/database/databases";

export const router = trpc
  .router<RequestContext>()
  .query("latestCirculatingSupply", {
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
