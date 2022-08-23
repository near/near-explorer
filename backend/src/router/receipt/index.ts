import * as trpc from "@trpc/server";
import { Context } from "../../context";
import { router as listRouter } from "./list";
import { router as getTransactionHashRouter } from "./get-transaction-hash";

export const router = trpc
  .router<Context>()
  .merge(listRouter)
  .merge(getTransactionHashRouter);
