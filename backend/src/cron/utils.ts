import { SubscriptionEventMap } from "../router/types";
import { CachedTimestampMap, RegularCheckFn } from "./types";

export const updateRegularlyFetchedMap = async <T>(
  ids: string[],
  mappings: CachedTimestampMap<T>,
  fetchFn: (id: string) => Promise<T>,
  refetchInterval: number,
  throwAwayTimeout: number
): Promise<void> => {
  const updatePromise = async (id: string) => {
    try {
      const result = await fetchFn(id);
      mappings.valueMap.set(id, result);
    } catch (e) {
      mappings.promisesMap.delete(id);
    }
  };
  for (const id of ids) {
    mappings.timestampMap.set(id, Date.now());
    if (!mappings.promisesMap.get(id)) {
      mappings.promisesMap.set(id, updatePromise(id));
      const intervalId = setInterval(() => {
        const lastTimestamp = mappings.timestampMap.get(id) || 0;
        if (Date.now() - lastTimestamp <= throwAwayTimeout) {
          mappings.promisesMap.set(id, updatePromise(id));
        } else {
          mappings.promisesMap.delete(id);
          clearInterval(intervalId);
        }
      }, refetchInterval);
    }
  }
  await Promise.all(ids.map((id) => mappings.promisesMap.get(id)));
};

type MaybePromise<T> = T | Promise<T>;

const strictEqual = <T>(a: T, b: T) => a === b;
export const getPublishIfChanged = (
  ...[publish, context]: Parameters<RegularCheckFn["fn"]>
) => <S extends keyof SubscriptionEventMap>(
  topic: S,
  nextData: Parameters<SubscriptionEventMap[S]>[0],
  equalFn: (
    a: Parameters<SubscriptionEventMap[S]>[0],
    b: Parameters<SubscriptionEventMap[S]>[0]
  ) => boolean = strictEqual
) => {
  const prevData = context.subscriptionsCache[topic];
  if (!prevData || !equalFn(prevData as typeof nextData, nextData)) {
    publish(topic, nextData);
  }
};

export const publishOnChange = <S extends keyof SubscriptionEventMap>(
  topic: S,
  fetcher: () => MaybePromise<Parameters<SubscriptionEventMap[S]>[0]>,
  intervalOrIntervalFn:
    | number
    | ((input: Parameters<SubscriptionEventMap[S]>[0]) => number),
  equalFn: (
    a: Parameters<SubscriptionEventMap[S]>[0],
    b: Parameters<SubscriptionEventMap[S]>[0]
  ) => boolean = strictEqual
): RegularCheckFn["fn"] => {
  return async (publish, context) => {
    const nextData = await fetcher();
    getPublishIfChanged(publish, context)(topic, nextData, equalFn);
    return typeof intervalOrIntervalFn === "function"
      ? intervalOrIntervalFn(nextData)
      : intervalOrIntervalFn;
  };
};
