import { Context } from "@/backend/context";
import {
  SubscriptionEventMap,
  SubscriptionTopicTypes,
} from "@/backend/router/types";

export type CachedTimestampMap<T> = {
  timestampMap: Map<string, number>;
  valueMap: Map<string, T>;
  promisesMap: Map<string, Promise<void>>;
};

export type PublishTopic = <S extends keyof SubscriptionEventMap>(
  event: S,
  arg: SubscriptionTopicTypes[S]
) => void;

export type RegularCheckFn = {
  description: string;
  fn: (publish: PublishTopic, context: Context) => Promise<number>;
  shouldSkip?: () => void;
};
