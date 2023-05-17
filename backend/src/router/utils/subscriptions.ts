import * as trpc from "@trpc/server";

import { Context } from "@explorer/backend/context";

export const router = trpc.router<Context>().query("subscriptionsCache", {
  resolve: ({ ctx }) => ctx.subscriptionsCache,
});
