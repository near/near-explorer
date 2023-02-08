import * as trpc from "@trpc/server";

import { Context } from "@explorer/backend/context";

import { router as getTransactionHashRouter } from "./get-transaction-hash";
import { router as listRouter } from "./list";

export const router = trpc
  .router<Context>()
  .merge(listRouter)
  .merge(getTransactionHashRouter);
