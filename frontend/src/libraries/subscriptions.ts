import * as ReactQuery from "react-query";

import {
  TRPCClient,
  TRPCError,
  TRPCSubscriptionInputs,
  TRPCSubscriptionKey,
  TRPCSubscriptionOutput,
} from "@explorer/common/types/trpc";

type ListenerTuple<Topic extends TRPCSubscriptionKey> = [
  (nextValue: TRPCSubscriptionOutput<Topic>) => void,
  (error: TRPCError) => void
];

type SubscriptionCache<Topic extends TRPCSubscriptionKey> = {
  listeners: ListenerTuple<Topic>[];
  lastValue?: TRPCSubscriptionOutput<Topic>;
  unsubscribe?: () => void;
};

const subscriptionCache: Partial<
  Record<string, SubscriptionCache<TRPCSubscriptionKey>>
> = {};

const createSubscription = <Topic extends TRPCSubscriptionKey>(
  cache: SubscriptionCache<Topic>,
  trpcClient: TRPCClient,
  pathAndInput: [path: Topic, ...args: TRPCSubscriptionInputs<Topic>]
): (() => void) => {
  const [path, input] = pathAndInput;
  return trpcClient.subscription(path, (input ?? undefined) as any, {
    onError: (err) => {
      cache.listeners.forEach(([, errorListener]) => errorListener(err));
    },
    onNext: (res) => {
      if (res.type !== "data") {
        return;
      }
      const typedValue = res.data as TRPCSubscriptionOutput<Topic>;
      cache.lastValue = typedValue;
      cache.listeners.forEach(([valueListener]) => valueListener(typedValue));
    },
  });
};

const removeSubscription = <Topic extends TRPCSubscriptionKey>(
  cache: SubscriptionCache<Topic>
) => {
  if (!cache.unsubscribe) {
    return;
  }
  cache.unsubscribe();
  cache.unsubscribe = undefined;
};

const removeListeners = <Topic extends TRPCSubscriptionKey>(
  cache: SubscriptionCache<Topic>,
  subscribeFns: ListenerTuple<Topic>
) => {
  cache.listeners = cache.listeners.filter(
    (listeners) => listeners !== subscribeFns
  );
};
const addListeners = <Topic extends TRPCSubscriptionKey>(
  cache: SubscriptionCache<Topic>,
  subscribeFns: ListenerTuple<Topic>
) => {
  cache.listeners.push(subscribeFns);
};

const getWithCache = <Topic extends TRPCSubscriptionKey>(
  pathAndInput: [path: Topic, ...args: TRPCSubscriptionInputs<Topic>]
) => {
  const queryKey = ReactQuery.hashQueryKey(pathAndInput);
  return (
    fn: (cache: SubscriptionCache<Topic>) => void,
    fnName: string,
    createCache = false
  ) => {
    let cache = subscriptionCache[queryKey] as
      | SubscriptionCache<Topic>
      | undefined;
    if (!cache) {
      if (!createCache) {
        // eslint-disable-next-line no-console
        console.warn(`called ${fnName} on non-existent subscription`);
        return;
      }
      cache = { listeners: [] };
      subscriptionCache[queryKey] = cache;
    }
    return fn(cache);
  };
};
export const subscribe = <Topic extends TRPCSubscriptionKey>(
  trpcClient: TRPCClient,
  pathAndInput: [path: Topic, ...args: TRPCSubscriptionInputs<Topic>],
  subscribeFns: ListenerTuple<Topic>
) => {
  const withCache = getWithCache(pathAndInput);
  return {
    subscribe: () =>
      withCache(
        (cache) => {
          if (cache.lastValue !== undefined) {
            subscribeFns[0](cache.lastValue);
          }
          if (!cache.unsubscribe) {
            cache.unsubscribe = createSubscription(
              cache,
              trpcClient,
              pathAndInput
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
        cache.unsubscribe = createSubscription(cache, trpcClient, pathAndInput);
      }, "resubscribe"),
  };
};
