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
  .merge(utilsRouter)
  .merge(statsRouter)
  .merge(blockRouter)
  .merge(transactionRouter)
  .merge(receiptRouter)
  .merge(accountRouter)
  .merge(contractRouter)
  .merge(telemetryRouter);

export type AppRouter = typeof router;
