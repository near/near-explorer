import * as trpc from "@trpc/server";

import { RequestContext } from "@/backend/context";

import { router as deployRouter } from "./deploy";
import { router as protocolRouter } from "./protocol";
import { router as searchRouter } from "./search";
import { router as subscriptionsRouter } from "./subscriptions";

export const router = trpc
  .router<RequestContext>()
  .merge(protocolRouter)
  .merge(deployRouter)
  .merge(searchRouter)
  .merge(subscriptionsRouter);
