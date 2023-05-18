import * as trpc from "@trpc/server";

import { RequestContext } from "@/backend/context";

import { router as byIdRouter } from "./by-id";
import { router as finalRouter } from "./final";
import { router as listRouter } from "./list";

export const router = trpc
  .router<RequestContext>()
  .merge(finalRouter)
  .merge(byIdRouter)
  .merge(listRouter);
