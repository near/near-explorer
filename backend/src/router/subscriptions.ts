import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "../context";
import { SubscriptionEventMap } from "./types";
import { SSR_TIMEOUT, wait } from "../common";
import {
  AnyRouter,
  CreateProcedureSubscription,
  RouterWithSubscriptionsAndQueries,
} from "../types";

const subscriptionInputs = {
  transactionsHistory: z.union([
    z.undefined(),
    z.strictObject({ amountOfDays: z.number() }),
  ]),
} as const;

type SubscriptionInputMap = typeof subscriptionInputs;

const processData = <T, I = undefined>(
  ...args: undefined extends I ? [T, (data: T, input: I) => T, I] : [T]
): T => {
  if (!args[1]) {
    return args[0];
  }
  return args[1](args[0], args[2]!);
};

const withTopics = <InitialRouter extends AnyRouter<Context>>(
  router: InitialRouter,
  topicsWithFilterFns: {
    [T in keyof SubscriptionEventMap]: T extends keyof SubscriptionInputMap
      ? (
          value: Parameters<SubscriptionEventMap[T]>[0],
          input: z.infer<SubscriptionInputMap[T]>
        ) => Parameters<SubscriptionEventMap[T]>[0]
      : undefined;
  }
): RouterWithSubscriptionsAndQueries<
  InitialRouter,
  {
    [SpecificTopic in keyof SubscriptionEventMap]: CreateProcedureSubscription<
      InitialRouter,
      Parameters<SubscriptionEventMap[SpecificTopic]>[0],
      SpecificTopic extends keyof SubscriptionInputMap
        ? z.infer<SubscriptionInputMap[SpecificTopic]>
        : undefined
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
    const input =
      topic in subscriptionInputs
        ? subscriptionInputs[topic as keyof typeof subscriptionInputs]
        : z.undefined();
    type TopicDataType = Parameters<SubscriptionEventMap[typeof topic]>[0] &
      Parameters<NonNullable<typeof filterFn>>[0];
    return router
      .subscription(topic, {
        input,
        resolve: ({ ctx, input }) => {
          return new trpc.Subscription<
            Parameters<SubscriptionEventMap[typeof topic]>[0]
          >((emit) => {
            const onData = (data: TopicDataType) => {
              emit.data(processData(data, filterFn!, input));
            };
            if (ctx.subscriptionsCache[topic]) {
              onData(ctx.subscriptionsCache[topic] as TopicDataType);
            }
            ctx.subscriptionsEventEmitter.on(topic, onData);
            return () => void ctx.subscriptionsEventEmitter.off(topic, onData);
          });
        },
      })
      .query(topic, {
        input,
        resolve: async ({ ctx, input }) => {
          if (!ctx.subscriptionsCache[topic]) {
            return new Promise(async (resolve) => {
              const onData = (data: TopicDataType) => {
                ctx.subscriptionsEventEmitter.off(topic, onData);
                resolve(processData(data, filterFn!, input));
              };
              ctx.subscriptionsEventEmitter.on(topic, onData);
              await wait(SSR_TIMEOUT);
              ctx.subscriptionsEventEmitter.off(topic, onData);
            });
          }
          const cachedData = ctx.subscriptionsCache[topic] as TopicDataType;
          return cachedData
            ? processData(cachedData, filterFn!, input)
            : cachedData;
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
  gasUsedHistory: undefined,
  "network-stats": undefined,
  transactionsHistory: (elements, input) =>
    input ? elements.slice(-input.amountOfDays) : elements,
  contractsHistory: undefined,
  activeContractsHistory: undefined,
  activeContractsList: undefined,
  rpcStatus: undefined,
  indexerStatus: undefined,
});
