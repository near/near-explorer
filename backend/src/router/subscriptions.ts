import * as trpc from "@trpc/server";
import { isEqual } from "lodash";
import { z } from "zod";

import { Context } from "@explorer/backend/context";
import {
  SubscriptionEventMap,
  SubscriptionTopicType,
  SubscriptionTopicTypes,
} from "@explorer/backend/router/types";
import {
  AnyRouter,
  CreateProcedureSubscription,
  RouterWithSubscriptionsAndQueries,
} from "@explorer/common/types/trpc";
import { wait } from "@explorer/common/utils/promise";
import { SSR_TIMEOUT } from "@explorer/common/utils/queries";

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

type SubscriptionInputModel<T extends SubscriptionTopicType> =
  T extends keyof SubscriptionInputMap
    ? SubscriptionInputMap[T]
    : z.ZodUndefined;
type SubscriptionInput<T extends SubscriptionTopicType> = z.infer<
  SubscriptionInputModel<T>
>;

const id = <T>(a: T) => a;

const withTopic = <
  InitialRouter extends AnyRouter<Context>,
  T extends SubscriptionTopicType
>(
  prevRouter: InitialRouter,
  topic: T,
  inputModel: SubscriptionInputModel<T>,
  mapFn: (
    data: SubscriptionTopicTypes[T],
    input: SubscriptionInput<T>
  ) => SubscriptionTopicTypes[T]
) =>
  prevRouter
    .subscription(topic, {
      input: inputModel,
      resolve: ({ ctx, input }) =>
        new trpc.Subscription<SubscriptionTopicTypes[T]>((emit) => {
          const typedInput = input as SubscriptionInput<T>;
          const onData: SubscriptionEventMap[T] = ((nextData, prevData) => {
            if (!prevData) {
              return emit.data(nextData as SubscriptionTopicTypes[T]);
            }
            const prevMappedData = mapFn(prevData, typedInput);
            const nextMappedData = mapFn(nextData, typedInput);
            if (!isEqual(nextMappedData, prevMappedData)) {
              emit.data(nextMappedData);
            }
          }) as SubscriptionEventMap[T];
          if (ctx.subscriptionsCache[topic]) {
            const cachedData = ctx.subscriptionsCache[
              topic
            ] as SubscriptionTopicTypes[T];
            onData(cachedData, cachedData);
          }
          ctx.subscriptionsEventEmitter.on<T>(topic, onData);
          return () => {
            ctx.subscriptionsEventEmitter.off<T>(topic, onData);
          };
        }),
    })
    .query(topic, {
      input: inputModel,
      resolve: async ({ ctx, input }) => {
        const typedInput = input as SubscriptionInput<T>;
        if (!ctx.subscriptionsCache[topic]) {
          return new Promise((resolve) => {
            const onData: SubscriptionEventMap[T] = ((data) => {
              ctx.subscriptionsEventEmitter.off(topic, onData);
              resolve(mapFn(data, typedInput));
            }) as SubscriptionEventMap[T];
            ctx.subscriptionsEventEmitter.on(topic, onData);
            wait(SSR_TIMEOUT).then(() =>
              ctx.subscriptionsEventEmitter.off(topic, onData)
            );
          });
        }
        const cachedData = ctx.subscriptionsCache[
          topic
        ] as SubscriptionTopicTypes[T];
        return cachedData ? mapFn(cachedData, typedInput) : undefined;
      },
    });

const withTopics = <InitialRouter extends AnyRouter<Context>>(
  initialRouter: InitialRouter,
  topicsWithMapFns: {
    [Topic in SubscriptionTopicType]: Topic extends keyof SubscriptionInputMap
      ? (
          value: SubscriptionTopicTypes[Topic],
          input: SubscriptionInput<Topic>
        ) => SubscriptionTopicTypes[Topic]
      : undefined;
  }
): RouterWithSubscriptionsAndQueries<
  InitialRouter,
  {
    [Topic in SubscriptionTopicType]: CreateProcedureSubscription<
      InitialRouter,
      SubscriptionTopicTypes[Topic],
      SubscriptionInput<Topic>
    >;
  }
> =>
  Object.entries(topicsWithMapFns).reduce(
    (router, [topic, mapFn = id]) =>
      withTopic(
        router,
        topic as keyof typeof topicsWithMapFns,
        topic in subscriptionInputs
          ? subscriptionInputs[topic as keyof typeof subscriptionInputs]
          : z.undefined(),
        mapFn as any
      ) as any,
    initialRouter
  ) as any;

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
  currentValidatorsCount: undefined,
});
