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
  unsubscribe: () => void;
};

const subscriptionCache: {
  [Topic in TRPCSubscriptionKey]?: Partial<
    Record<string, SubscriptionCache<Topic>>
  >;
} = {};

export const subscribe = <Topic extends TRPCSubscriptionKey>(
  trpcClient: TRPCClient,
  pathAndInput: [path: Topic, ...args: TRPCSubscriptionInputs<Topic>],
  subscribeFns: ListenerTuple<Topic>
) => {
  const [path, input] = pathAndInput;
  const queryKey = ReactQuery.hashQueryKey(pathAndInput);
  if (!subscriptionCache[path]) {
    subscriptionCache[path] = {};
  }
  const topicCaches = subscriptionCache[path]! as Partial<
    Record<string, SubscriptionCache<Topic>>
  >;
  if (!topicCaches[queryKey]) {
    topicCaches[queryKey] = {
      unsubscribe: trpcClient.subscription(path, (input ?? undefined) as any, {
        onError: (err) => {
          const cache = topicCaches[queryKey];
          if (!cache) {
            return;
          }
          cache.listeners.forEach(([, errorListener]) => errorListener(err));
        },
        onNext: (res) => {
          const cache = topicCaches[queryKey];
          if (!cache || res.type !== "data") {
            return;
          }
          const typedValue = res.data as TRPCSubscriptionOutput<Topic>;
          cache.lastValue = typedValue;
          cache.listeners.forEach(([valueListener]) =>
            valueListener(typedValue)
          );
        },
      }),
      listeners: [],
    };
  } else {
    const { lastValue } = topicCaches[queryKey]!;
    if (lastValue !== undefined) {
      subscribeFns[0](lastValue);
    }
  }
  const cache = topicCaches[queryKey]!;
  cache.listeners.push(subscribeFns);

  return () => {
    cache.listeners = cache.listeners.filter(
      (listeners) => listeners !== subscribeFns
    );
    if (cache.listeners.length === 0) {
      cache.unsubscribe();
      subscriptionCache[path] = undefined;
    }
  };
};
