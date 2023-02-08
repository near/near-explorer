import * as trpc from "@trpc/server";
import { sql } from "kysely";
import { z } from "zod";

import { Context } from "@explorer/backend/context";
import { indexerDatabase } from "@explorer/backend/database/databases";
import { sum } from "@explorer/backend/database/utils";

export const router = trpc.router<Context>().query("tokensBurnt", {
  input: z.strictObject({
    daysFromNow: z.number().min(1).max(7),
  }),
  resolve: async ({ input: { daysFromNow } }) => {
    const feesByDay = await indexerDatabase
      .selectFrom("execution_outcomes")
      .select([
        sql<Date>`date_trunc(
            'day', now() - (${daysFromNow} || 'days')::interval
          )`.as("date"),
        (eb) => sum(eb, "tokens_burnt").as("tokensBurnt"),
      ])
      .where(
        "executed_in_block_timestamp",
        ">=",
        sql`cast(
            extract(
              epoch from date_trunc(
                'day', now() - (${daysFromNow} || 'days')::interval
              )
            ) as bigint
          ) * 1000 * 1000 * 1000`
      )
      .where(
        "executed_in_block_timestamp",
        "<",
        sql`cast(
            extract(
              epoch from date_trunc(
                'day', now() - (${daysFromNow - 1} || 'days')::interval
              )
            ) as bigint
          ) * 1000 * 1000 * 1000`
      )
      .executeTakeFirst();
    if (!feesByDay) {
      return null;
    }
    return {
      timestamp: feesByDay.date.valueOf(),
      tokensBurnt: feesByDay.tokensBurnt || "0",
    };
  },
});
