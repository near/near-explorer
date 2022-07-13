import * as trpc from "@trpc/server";
import { Context } from "../../context";
import { router as circulatingSupplyRouter } from "./circulating-supply";
import { router as tokensBurntRouter } from "./tokens-burnt";
import { router as historyRouter } from "./history";

export const router = trpc
  .router<Context>()
  .merge(circulatingSupplyRouter)
  .merge(tokensBurntRouter)
  .merge(historyRouter);
