import * as trpc from "@trpc/server";

import { RequestContext } from "@/backend/context";

export const router = trpc
  .router<RequestContext>()
  .query("subscriptionsCache", {
    resolve: ({ ctx }) => ctx.subscriptionsCache,
  });
