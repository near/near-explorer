import * as trpc from "@trpc/server";

import { RequestContext } from "@explorer/backend/context";

import { router as getRouter } from "./get";
import { router as listRouter } from "./list";

export const router = trpc
  .router<RequestContext>()
  .merge(getRouter)
  .merge(listRouter);
