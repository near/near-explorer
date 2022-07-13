import * as trpc from "@trpc/server";
import { Context } from "../../context";
import { router as byIdRouter } from "./by-id";
import { router as listRouter } from "./list";
import { router as getHashByIdRouter } from "./get-hash-by-id";
import { router as finalRouter } from "./final";

export const router = trpc
  .router<Context>()
  .merge(finalRouter)
  .merge(byIdRouter)
  .merge(getHashByIdRouter)
  .merge(listRouter);
