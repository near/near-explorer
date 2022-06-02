import * as trpc from "@trpc/server";
import { ProcedureResolver } from "@trpc/server/dist/declarations/src/internals/procedure";
import { Subscription } from "@trpc/server";

import { Context } from "../context";
import { SubscriptionEventMap } from "./types";

const getSubscriptionResolve = <S extends keyof SubscriptionEventMap>(
  path: S
): ProcedureResolver<
  Context,
  undefined,
  Subscription<Parameters<SubscriptionEventMap[S]>[0]>
> => async ({ ctx }) =>
  new trpc.Subscription<Parameters<SubscriptionEventMap[S]>[0]>((emit) => {
    const onData = emit.data as SubscriptionEventMap[S];
    if (ctx.subscriptionsCache[path]) {
      onData(ctx.subscriptionsCache[path]!);
    }
    ctx.subscriptionsEventEmitter.on(path, onData);
    return () => void ctx.subscriptionsEventEmitter.off(path, onData);
  });

const getQueryResolve = <S extends keyof SubscriptionEventMap>(
  path: S
): ProcedureResolver<
  Context,
  undefined,
  Parameters<SubscriptionEventMap[S]>[0] | undefined
> => ({ ctx }) => ctx.subscriptionsCache[path];

/*
  TODO: write a function to add an ability to easily add subscriptions
  Something like this:

  const addSubscription = <S extends keyof SubscriptionEventMap>(
    router: Router<..>,
    path: S
  ): Router<.. & OutputFromSubscription> => {
    return router.query(path, {
      resolve: () => { resolution of cache }
    })
    .subscription(path, {
      resolve: () => { (un)subscription, emit lastValue on connect }
    })
  };

  const router = ['chain-blocks-stats', ...].reduce((router, path) =>
    addSubscription(router, path),
    trpc.router<Context>()
  );
  export default router;
*/

export const router = trpc
  .router<Context>()
  .query("blockProductionSpeed", {
    resolve: getQueryResolve("blockProductionSpeed"),
  })
  .subscription("blockProductionSpeed", {
    resolve: getSubscriptionResolve("blockProductionSpeed"),
  })
  .query("latestBlock", {
    resolve: getQueryResolve("latestBlock"),
  })
  .subscription("latestBlock", {
    resolve: getSubscriptionResolve("latestBlock"),
  })
  .query("latestGasPrice", {
    resolve: getQueryResolve("latestGasPrice"),
  })
  .subscription("latestGasPrice", {
    resolve: getSubscriptionResolve("latestGasPrice"),
  })
  .query("validators", {
    resolve: getQueryResolve("validators"),
  })
  .subscription("validators", {
    resolve: getSubscriptionResolve("validators"),
  })
  .query("recentTransactionsCount", {
    resolve: getQueryResolve("recentTransactionsCount"),
  })
  .subscription("recentTransactionsCount", {
    resolve: getSubscriptionResolve("recentTransactionsCount"),
  })
  .query("network-stats", {
    resolve: getQueryResolve("network-stats"),
  })
  .subscription("network-stats", {
    resolve: getSubscriptionResolve("network-stats"),
  });
