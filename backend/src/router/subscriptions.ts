import * as trpc from "@trpc/server";

import { Context } from "../context";
import { SubscriptionEventMap } from "./types";
import { SSR_TIMEOUT, wait } from "../common";
import {
  AnyRouter,
  CreateProcedureSubscription,
  RouterWithSubscriptionsAndQueries,
} from "../types";

const withTopics = <InitialRouter extends AnyRouter<Context>>(
  router: InitialRouter,
  topicsWithFilterFns: {
    [T in keyof SubscriptionEventMap]: undefined;
  }
): RouterWithSubscriptionsAndQueries<
  InitialRouter,
  {
    [SpecificTopic in keyof typeof topicsWithFilterFns]: CreateProcedureSubscription<
      InitialRouter,
      Parameters<SubscriptionEventMap[SpecificTopic]>[0]
    >;
  }
> => {
  type TopicsFns = typeof topicsWithFilterFns;
  return (
    Object.entries(topicsWithFilterFns) as [
      keyof TopicsFns,
      TopicsFns[keyof TopicsFns]
    ][]
  ).reduce((router, [topic, filterFn]) => {
    return router
      .subscription(topic, {
        resolve: ({ ctx }) => {
          return new trpc.Subscription<
            Parameters<SubscriptionEventMap[typeof topic]>[0]
          >((emit) => {
            const onData = (
              data: Parameters<SubscriptionEventMap[typeof topic]>[0]
            ) => {
              emit.data(data);
            };
            if (ctx.subscriptionsCache[topic]) {
              onData(ctx.subscriptionsCache[topic]!);
            }
            ctx.subscriptionsEventEmitter.on(topic, onData);
            return () => void ctx.subscriptionsEventEmitter.off(topic, onData);
          });
        },
      })
      .query(topic, {
        resolve: async ({ ctx }) => {
          if (!ctx.subscriptionsCache[topic]) {
            return new Promise(async (resolve) => {
              const onData = (
                data: Parameters<SubscriptionEventMap[typeof topic]>[0]
              ) => {
                ctx.subscriptionsEventEmitter.off(topic, onData);
                resolve(data);
              };
              ctx.subscriptionsEventEmitter.on(topic, onData);
              await wait(SSR_TIMEOUT);
              ctx.subscriptionsEventEmitter.off(topic, onData);
            });
          }
          const cachedData = ctx.subscriptionsCache[topic] as Parameters<
            SubscriptionEventMap[typeof topic]
          >[0] &
            Parameters<NonNullable<typeof filterFn>>[0];
          return cachedData;
        },
      }) as any;
  }, router) as any;
};

export const router = withTopics(trpc.router<Context>(), {
  blockProductionSpeed: undefined,
  latestBlock: undefined,
  latestGasPrice: undefined,
  validators: undefined,
  recentTransactionsCount: undefined,
  onlineNodesCount: undefined,
  genesisConfig: undefined,
  tokensSupply: undefined,
  "network-stats": undefined,
});
