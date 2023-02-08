import * as trpc from "@trpc/server";

import { Context } from "@explorer/backend/context";
import { router as listRouter } from "./list";
import { router as getRouter } from "./get";

export const router = trpc.router<Context>().merge(getRouter).merge(listRouter);
