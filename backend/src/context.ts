import type TypedEmitter from "typed-emitter";

import type { GlobalState } from "@explorer/backend/global-state";
import {
  SubscriptionEventMap,
  SubscriptionTopicType,
  SubscriptionTopicTypes,
} from "@explorer/backend/router/types";

export type Context = {
  state: GlobalState;
  subscriptionsCache: {
    [S in SubscriptionTopicType]?: SubscriptionTopicTypes[S];
  };
  subscriptionsEventEmitter: TypedEmitter<SubscriptionEventMap>;
};
