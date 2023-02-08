import * as trpc from "@trpc/server";

import { Context } from "@explorer/backend/context";

import { router as byIdRouter } from "./by-id";

export const router = trpc.router<Context>().merge(byIdRouter);
