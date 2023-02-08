import * as trpc from "@trpc/server";

import { Context } from "@explorer/backend/context";

import { router as getRouter } from "./get";
import { router as listRouter } from "./list";

export const router = trpc.router<Context>().merge(getRouter).merge(listRouter);
