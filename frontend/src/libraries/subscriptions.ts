import {
  TRPCClient,
  TRPCError,
  TRPCSubscriptionInputs,
  TRPCSubscriptionKey,
  TRPCSubscriptionOutput,
} from "../types/common";

type ListenerTuple<Topic extends TRPCSubscriptionKey> = [
  (nextValue: TRPCSubscriptionOutput<Topic>) => void,
  (error: TRPCError) => void
];

const subscriptionCache: {
  [Topic in TRPCSubscriptionKey]?: {
    listeners: ListenerTuple<Topic>[];
    lastValue?: TRPCSubscriptionOutput<Topic>;
    unsubscribe: () => void;
  };
} = {};

export const subscribe = <Topic extends TRPCSubscriptionKey>(
  trpcClient: TRPCClient,
  pathAndInput: [path: Topic, ...args: TRPCSubscriptionInputs<Topic>],
  subscribeFns: ListenerTuple<Topic>
) => {
  const [path, input] = pathAndInput;
  if (!subscriptionCache[path]) {
    subscriptionCache[path] = {
      unsubscribe: trpcClient.subscription(path, (input ?? undefined) as any, {
        onError: (err) => {
          if (!subscriptionCache[path]) {
            return;
          }
          subscriptionCache[path]!.listeners.forEach(([, errorListener]) =>
            errorListener(err)
          );
        },
        onNext: (res) => {
          if (!subscriptionCache[path] || res.type !== "data") {
            return;
          }
          const typedValue = res.data as TRPCSubscriptionOutput<Topic>;
          subscriptionCache[path]!.lastValue = typedValue;
          subscriptionCache[path]!.listeners.forEach(([valueListener]) =>
            valueListener(typedValue)
          );
        },
      }),
      listeners: [],
    };
  } else {
    const lastValue = subscriptionCache[path]!.lastValue;
    if (lastValue !== undefined) {
      subscribeFns[0](lastValue);
    }
  }
  const cache = subscriptionCache[path]!;
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
