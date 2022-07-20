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
  accountsHistory: z.union([
    z.undefined(),
    z.strictObject({ amountOfDays: z.number() }),
  ]),
} as const;

type SubscriptionInputMap = typeof subscriptionInputs;

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
    type TopicDataType = Parameters<SubscriptionEventMap[typeof topic]>[0];
    const getProcessedData = (
      data: TopicDataType,
      input: z.infer<SubscriptionInputMap[keyof typeof subscriptionInputs]>
    ) => {
      if (filterFn) {
        return filterFn(data as any, input);
      } else {
        return data;
      }
    };
    return router
      .subscription(topic, {
        input,
        resolve: ({ ctx, input }) => {
          return new trpc.Subscription<
            Parameters<SubscriptionEventMap[typeof topic]>[0]
          >((emit) => {
            const onData = (data: TopicDataType) => {
              emit.data(getProcessedData(data, input));
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
                resolve(getProcessedData(data, input));
              };
              ctx.subscriptionsEventEmitter.on(topic, onData);
              await wait(SSR_TIMEOUT);
              ctx.subscriptionsEventEmitter.off(topic, onData);
            });
          }
          const cachedData = ctx.subscriptionsCache[topic] as TopicDataType;
          return cachedData ? getProcessedData(cachedData, input) : cachedData;
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
  accountsHistory: ({ newAccounts, liveAccounts }, input) => ({
    newAccounts: input ? newAccounts.slice(-input.amountOfDays) : newAccounts,
    liveAccounts: input
      ? liveAccounts.slice(-input.amountOfDays)
      : liveAccounts,
  }),
  activeAccountsList: undefined,
  activeAccountsHistory: undefined,
  "network-stats": undefined,
  transactionsHistory: (elements, input) =>
    input ? elements.slice(-input.amountOfDays) : elements,
  contractsHistory: undefined,
  activeContractsHistory: undefined,
  activeContractsList: undefined,
  rpcStatus: undefined,
  indexerStatus: undefined,
});
