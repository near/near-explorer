import { indexerDatabase } from "@/backend/database/databases";
import { t } from "@/backend/router/trpc";

export const procedure = t.procedure.query(async () => {
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
});
