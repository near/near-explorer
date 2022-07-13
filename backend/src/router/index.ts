import * as trpc from "@trpc/server";
import { Context } from "../context";
import { router as subscriptionsRouter } from "./subscriptions";
import { router as telemetryRouter } from "./telemetry";
import { router as blockRouter } from "./block";
import { router as statsRouter } from "./stats";
import { router as transactionRouter } from "./transaction";
import { router as accountRouter } from "./account";
import { router as contractRouter } from "./contract";
import { router as receiptRouter } from "./receipt";
import { router as utilsRouter } from "./utils";

export const router = trpc
  .router<Context>()
  .merge(subscriptionsRouter)
  .merge("utils.", utilsRouter)
  .merge(statsRouter)
  .merge("block.", blockRouter)
  .merge(transactionRouter)
  .merge(receiptRouter)
  .merge("account.", accountRouter)
  .merge("contract.", contractRouter)
  .merge("telemetry.", telemetryRouter);

export type AppRouter = typeof router;
