import * as trpc from "@trpc/server";

import { RequestContext } from "@/backend/context";
import { getEnvironment } from "@/common/utils/environment";

import { router as accountRouter } from "./account";
import { router as blockRouter } from "./block";
import { router as contractRouter } from "./contract";
import { router as fungibleTokensRouter } from "./fungible-tokens";
import { router as receiptRouter } from "./receipt";
import { router as statsRouter } from "./stats";
import { router as subscriptionsRouter } from "./subscriptions";
import { router as telemetryRouter } from "./telemetry";
import { router as transactionRouter } from "./transaction";
import { router as utilsRouter } from "./utils";

export const router = trpc
  .router<RequestContext>()
  // Stripping out the stack on production environment
  .formatError(({ shape }) =>
    getEnvironment() === "prod"
      ? {
          ...shape,
          data: { ...shape.data, stack: undefined },
        }
      : shape
  )
  .merge(subscriptionsRouter)
  .merge("utils.", utilsRouter)
  .merge("stats.", statsRouter)
  .merge("block.", blockRouter)
  .merge("transaction.", transactionRouter)
  .merge("receipt.", receiptRouter)
  .merge("account.", accountRouter)
  .merge("contract.", contractRouter)
  .merge("telemetry.", telemetryRouter)
  .merge("fungibleTokens.", fungibleTokensRouter);

export type AppRouter = typeof router;
