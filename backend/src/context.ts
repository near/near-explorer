import { GlobalState } from "./global-state";
import { SubscriptionTopicType, SubscriptionTopicTypes } from "./types";

export type Context = {
  state: GlobalState;
  publishWamp: <T extends SubscriptionTopicType>(
    topic: T,
    args: SubscriptionTopicTypes[T]
  ) => void;
};
