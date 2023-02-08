import * as trpc from "@trpc/server";
import { Context } from "@explorer/backend/context";
import { router as byIdRouter } from "./by-id";
import { router as listRouter } from "./list";
import { router as transactionsCountRouter } from "./transactions-count";
import { router as fungibleTokensRouter } from "./fungible-tokens";
import { router as activityRouter } from "./activity";
import { router as nonFungibleTokensRouter } from "./non-fungible-tokens";

export const router = trpc
  .router<Context>()
  .merge(byIdRouter)
  .merge(listRouter)
  .merge(transactionsCountRouter)
  .merge(fungibleTokensRouter)
  .merge(activityRouter)
  .merge(nonFungibleTokensRouter);
