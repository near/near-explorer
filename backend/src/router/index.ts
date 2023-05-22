import { t } from "@/backend/router/trpc";

import { router as accountRouter } from "./account";
import { router as blockRouter } from "./block";
import { router as contractRouter } from "./contract";
import { router as fungibleTokensRouter } from "./fungible-tokens";
import { router as receiptRouter } from "./receipt";
import { router as statsRouter } from "./stats";
import { subscriptionRouter, queryRouter } from "./subscriptions";
import { procedure as upsert } from "./telemetry";
import { router as transactionRouter } from "./transaction";
import { router as utilsRouter } from "./utils";

export const appRouter = t.router({
  utils: utilsRouter,
  stats: statsRouter,
  block: blockRouter,
  transaction: transactionRouter,
  receipt: receiptRouter,
  account: accountRouter,
  contract: contractRouter,
  telemetry: t.router({ upsert }),
  fungibleTokens: fungibleTokensRouter,
  subscriptions: subscriptionRouter,
  queries: queryRouter,
});

export type AppRouter = typeof appRouter;
