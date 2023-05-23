import { CreateTRPCProxyClient, getQueryKey } from "@trpc/react-query";
import type { Unsubscribable } from "@trpc/server/observable";

import {
  AppRouter,
  TRPCClient,
  TRPCError,
  TRPCSubscriptionInput,
  TRPCSubscriptionKey,
  TRPCSubscriptionOutput,
} from "@/common/types/trpc";
import { trpc } from "@/frontend/libraries/trpc";

type TRPCContextLike = {
  client: CreateTRPCProxyClient<AppRouter>;
};

export type TRPCShortSubscriptionKey<
  Topic extends TRPCSubscriptionKey = TRPCSubscriptionKey
> = Topic extends `subscriptions.${infer LocalKey}`
  ? LocalKey extends keyof TRPCClient["queries"]
    ? LocalKey
    : never
  : never;

type ListenerTuple<
  K extends TRPCShortSubscriptionKey = TRPCShortSubscriptionKey
> = [
  (nextValue: TRPCSubscriptionOutput<`subscriptions.${K}`>) => void,
  (error: TRPCError) => void
];

type SubscriptionCache<
  K extends TRPCShortSubscriptionKey = TRPCShortSubscriptionKey
> = {
  listeners: ListenerTuple<K>[];
  lastValue?: TRPCSubscriptionOutput<`subscriptions.${K}`>;
  subscription?: Unsubscribable;
};

const subscriptionCache: Partial<
  Record<string, SubscriptionCache<TRPCShortSubscriptionKey>>
> = {};

const createSubscription = <Key extends TRPCShortSubscriptionKey>(
  cache: SubscriptionCache<Key>,
  trpcContext: TRPCContextLike,
  key: Key,
  input: TRPCSubscriptionInput<`subscriptions.${Key}`>
): Unsubscribable =>
  (
    trpcContext.client.subscriptions[
      key
      // An example of a subscription to get valid types on callbacks
    ] as TRPCContextLike["client"]["subscriptions"]["validatorTelemetry"]
  )
    // @ts-expect-error
    .subscribe(input, {
      onError: (err) => {
        cache.listeners.forEach(([, errorListener]) => errorListener(err));
      },
      onData: (data) => {
        const typedValue =
          data as TRPCSubscriptionOutput<`subscriptions.${Key}`>;
        cache.lastValue = typedValue;
        cache.listeners.forEach(([valueListener]) => valueListener(typedValue));
      },
    });

const removeSubscription = <Key extends TRPCShortSubscriptionKey>(
  cache: SubscriptionCache<Key>
) => {
  if (!cache.subscription) {
    return;
  }
  cache.subscription.unsubscribe();
  cache.subscription = undefined;
};

const removeListeners = <Key extends TRPCShortSubscriptionKey>(
  cache: SubscriptionCache<Key>,
  subscribeFns: ListenerTuple<Key>
) => {
  cache.listeners = cache.listeners.filter(
    (listeners) => listeners !== subscribeFns
  );
};
const addListeners = <Key extends TRPCShortSubscriptionKey>(
  cache: SubscriptionCache<Key>,
  subscribeFns: ListenerTuple<Key>
) => {
  cache.listeners.push(subscribeFns);
};

const getWithCache = <Key extends TRPCShortSubscriptionKey>(
  key: Key,
  input: TRPCSubscriptionInput<`subscriptions.${Key}`>
) => {
  // @ts-expect-error
  const cacheKey = getQueryKey(trpc.queries[key], input).join(",");
  return (
    fn: (cache: SubscriptionCache<Key>) => void,
    fnName: string,
    createCache = false
  ) => {
    let cache = subscriptionCache[cacheKey] as
      | SubscriptionCache<Key>
      | undefined;
    if (!cache) {
      if (!createCache) {
        // eslint-disable-next-line no-console
        console.warn(`called ${fnName} on non-existent subscription`);
        return;
      }
      cache = { listeners: [] };
      // @ts-expect-error
      subscriptionCache[cacheKey] = cache;
    }
    return fn(cache);
  };
};
export const getSubscriber = <Key extends TRPCShortSubscriptionKey>(
  trpcContext: TRPCContextLike,
  key: Key,
  input: TRPCSubscriptionInput<`subscriptions.${Key}`>,
  subscribeFns: ListenerTuple<Key>
) => {
  const withCache = getWithCache(key, input);
  return {
    subscribe: () =>
      withCache(
        (cache) => {
          if (cache.lastValue !== undefined) {
            subscribeFns[0](cache.lastValue);
          }
          if (!cache.subscription) {
            cache.subscription = createSubscription(
              cache,
              trpcContext,
              key,
              input
            );
          }
          addListeners(cache, subscribeFns);
        },
        "subscribe",
        true
      ),
    unsubscribe: () =>
      withCache((cache) => {
        removeListeners(cache, subscribeFns);
        if (cache.listeners.length === 0) {
          removeSubscription(cache);
        }
      }, "unsubscribe"),
    resubscribe: () =>
      withCache((cache) => {
        removeSubscription(cache);
        cache.subscription = createSubscription(cache, trpcContext, key, input);
      }, "resubscribe"),
  };
};
