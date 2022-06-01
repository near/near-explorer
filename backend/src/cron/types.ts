import { Context } from "../context";
import { SubscriptionEventMap } from "../router/types";

export type CachedTimestampMap<T> = {
  timestampMap: Map<string, number>;
  valueMap: Map<string, T>;
  promisesMap: Map<string, Promise<void>>;
};

export type PublishTopic = <S extends keyof SubscriptionEventMap>(
  event: S,
  arg: Parameters<SubscriptionEventMap[S]>[0]
) => void;

export type RegularCheckFn = {
  description: string;
  fn: (publish: PublishTopic, context: Context) => Promise<number>;
  shouldSkip?: () => void;
};
