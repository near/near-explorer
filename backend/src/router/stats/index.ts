import * as trpc from "@trpc/server";

import { RequestContext } from "@/backend/context";

import { router as circulatingSupplyRouter } from "./circulating-supply";
import { router as tokensBurntRouter } from "./tokens-burnt";

export const router = trpc
  .router<RequestContext>()
  .merge(circulatingSupplyRouter)
  .merge(tokensBurntRouter);
