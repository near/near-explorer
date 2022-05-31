import * as trpc from "@trpc/server";
import { Context } from "../context";
import { router as subscriptionsRouter } from "./subscriptions";
import { router as proceduresRouter } from "./procedures";

export const router = trpc
  .router<Context>()
  .merge(subscriptionsRouter)
  .merge(proceduresRouter);

export type AppRouter = typeof router;
