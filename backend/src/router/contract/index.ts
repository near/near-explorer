import * as trpc from "@trpc/server";

import { RequestContext } from "@explorer/backend/context";

import { router as byIdRouter } from "./by-id";

export const router = trpc.router<RequestContext>().merge(byIdRouter);
