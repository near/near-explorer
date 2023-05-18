import { isEqual } from "lodash";

import { Context } from "@explorer/backend/context";
import {
  CachedTimestampMap,
  RegularCheckFn,
} from "@explorer/backend/cron/types";
import {
  SubscriptionEventMap,
  SubscriptionTopicTypes,
} from "@explorer/backend/router/types";

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

export const getPublishIfChanged =
  (...[publish, context]: Parameters<RegularCheckFn["fn"]>) =>
  <S extends keyof SubscriptionEventMap>(
    topic: S,
    nextData: SubscriptionTopicTypes[S],
    equalFn: (
      a: SubscriptionTopicTypes[S],
      b: SubscriptionTopicTypes[S]
    ) => boolean = isEqual
  ) => {
    const prevData = context.subscriptionsCache[topic];
    if (!prevData || !equalFn(prevData, nextData)) {
      publish(topic, nextData);
    }
  };

export const publishOnChange =
  <S extends keyof SubscriptionEventMap>(
    topic: S,
    fetcher: (context: Context) => MaybePromise<SubscriptionTopicTypes[S]>,
    intervalOrIntervalFn:
      | number
      | ((input: SubscriptionTopicTypes[S]) => number),
    equalFn: (
      a: SubscriptionTopicTypes[S],
      b: SubscriptionTopicTypes[S]
    ) => boolean = isEqual
  ): RegularCheckFn["fn"] =>
  async (publish, context) => {
    const nextData = await fetcher(context);
    getPublishIfChanged(publish, context)(topic, nextData, equalFn);
    return typeof intervalOrIntervalFn === "function"
      ? intervalOrIntervalFn(nextData)
      : intervalOrIntervalFn;
  };
