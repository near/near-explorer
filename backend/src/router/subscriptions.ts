import type {
  DefaultDataTransformer,
  DefaultErrorShape,
  Procedure,
  ProcedureParams,
  RootConfig,
} from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { isEqual } from "lodash";
import { z } from "zod";

import { RequestContext } from "@/backend/context";
import { t } from "@/backend/router/trpc";
import {
  SubscriptionEventMap,
  SubscriptionTopicType,
  SubscriptionTopicTypes,
} from "@/backend/router/types";
import { wait } from "@/common/utils/promise";
import { SSR_TIMEOUT } from "@/common/utils/queries";
import { id } from "@/common/utils/utils";

type AppRouterConfig = RootConfig<{
  ctx: RequestContext;
  meta: {};
  errorShape: DefaultErrorShape;
  transformer: DefaultDataTransformer;
}>;

const subscriptionInputs = {
  transactionsHistory: z.union([
    z.undefined(),
    z.strictObject({ amountOfDays: z.number() }),
  ]),
  accountsHistory: z.union([
    z.undefined(),
    z.strictObject({ amountOfDays: z.number() }),
  ]),
  validatorTelemetry: z.string(),
} as const;

type SubscriptionInputMap = typeof subscriptionInputs;

type SubscriptionInputModel<T extends SubscriptionTopicType> =
  T extends keyof SubscriptionInputMap
    ? SubscriptionInputMap[T]
    : z.ZodUndefined;
type SubscriptionInput<T extends SubscriptionTopicType> = z.infer<
  SubscriptionInputModel<T>
>;

type ValueInRecord<M> = M extends Record<any, infer V> ? V : never;
type OutputMapping = {
  validatorTelemetry?: ValueInRecord<
    SubscriptionTopicTypes["validatorTelemetry"]
  >;
};
type MappedSubscriptionTopicType<T extends SubscriptionTopicType> =
  T extends keyof OutputMapping ? OutputMapping[T] : SubscriptionTopicTypes[T];

type MapFunction<T extends SubscriptionTopicType> = (
  data: SubscriptionTopicTypes[T],
  input: SubscriptionInput<T>
) => MappedSubscriptionTopicType<T>;
type MaybeMapFunction<T extends SubscriptionTopicType> =
  T extends keyof SubscriptionInputMap ? MapFunction<T> : undefined;
type MapFunctions = {
  [T in SubscriptionTopicType]: MaybeMapFunction<T>;
};

const getInput = <T extends SubscriptionTopicType>(topic: T) => {
  if (topic in subscriptionInputs) {
    return subscriptionInputs[topic as keyof SubscriptionInputMap];
  }
  return z.undefined();
};

const getSubscriptionProcedure = <T extends SubscriptionTopicType>(
  topic: T,
  mapFn: MapFunction<T>
) =>
  t.procedure.input(getInput(topic)).subscription(({ ctx, input }) =>
    observable<MappedSubscriptionTopicType<T>>((emit) => {
      const typedInput = input as SubscriptionInput<T>;
      const onData: SubscriptionEventMap[T] = ((nextData, prevData) => {
        const nextMappedData = mapFn(nextData, typedInput);
        if (!prevData) {
          return emit.next(nextMappedData);
        }
        const prevMappedData = mapFn(prevData, typedInput);
        if (!isEqual(nextMappedData, prevMappedData)) {
          emit.next(nextMappedData);
        }
      }) as SubscriptionEventMap[T];
      if (ctx.subscriptionsCache[topic]) {
        const cachedData = ctx.subscriptionsCache[
          topic
        ] as SubscriptionTopicTypes[T];
        onData(cachedData);
      }
      ctx.subscriptionsEventEmitter.on(topic, onData);
      return () => {
        ctx.subscriptionsEventEmitter.off(topic, onData);
      };
    })
  );

const getQueryProcedure = <T extends SubscriptionTopicType>(
  topic: T,
  mapFn: MapFunction<T>
) =>
  t.procedure.input(getInput(topic)).query(async ({ ctx, input }) => {
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
  });

const subscriptionFilters: MapFunctions = {
  blockProductionSpeed: undefined,
  latestBlock: undefined,
  latestGasPrice: undefined,
  validators: undefined,
  validatorTelemetry: (elements, accountId) => elements[accountId],
  recentTransactionsCount: undefined,
  onlineNodesCount: undefined,
  genesisConfig: undefined,
  protocolConfig: undefined,
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
  epochStats: undefined,
  epochStartBlock: undefined,
  transactionsHistory: (elements, input) =>
    input ? elements.slice(-input.amountOfDays) : elements,
  contractsHistory: undefined,
  activeContractsHistory: undefined,
  activeContractsList: undefined,
  rpcStatus: undefined,
  indexerStatus: undefined,
  currentValidatorsCount: undefined,
};

const topicsFilterFnEntries = Object.entries(subscriptionFilters) as [
  keyof MapFunctions,
  MapFunctions[keyof MapFunctions]
][];

type ProceduresMapping<Type extends "query" | "subscription"> = {
  [SpecificTopic in SubscriptionTopicType]: Procedure<
    Type,
    ProcedureParams<
      AppRouterConfig,
      unknown,
      SubscriptionInput<SpecificTopic>,
      SubscriptionInput<SpecificTopic>,
      MappedSubscriptionTopicType<SpecificTopic>,
      MappedSubscriptionTopicType<SpecificTopic>
    >
  >;
};

export const queryRouter = t.router(
  topicsFilterFnEntries.reduce(
    (app, [topic, mapFn = id]) => ({
      ...app,
      [topic]: getQueryProcedure(topic, mapFn as MapFunction<typeof topic>),
    }),
    {} as ProceduresMapping<"query">
  )
);

export const subscriptionRouter = t.router(
  topicsFilterFnEntries.reduce(
    (app, [topic, mapFn = id]) => ({
      ...app,
      [topic]: getSubscriptionProcedure(
        topic,
        mapFn as MapFunction<typeof topic>
      ),
    }),
    {} as ProceduresMapping<"subscription">
  )
);
