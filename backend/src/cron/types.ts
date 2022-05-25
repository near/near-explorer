import { Context } from "../context";

export type CachedTimestampMap<T> = {
  timestampMap: Map<string, number>;
  valueMap: Map<string, T>;
  promisesMap: Map<string, Promise<void>>;
};

export type RegularCheckFn = {
  description: string;
  fn: (publish: Context["publishWamp"], context: Context) => Promise<void>;
  interval: number;
  shouldSkip?: () => void;
};
