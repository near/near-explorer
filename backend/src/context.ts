import TypedEmitter from "typed-emitter";

import { GlobalState } from "@explorer/backend/global-state";
import { SubscriptionEventMap } from "@explorer/backend/router/types";

export type Context = {
  state: GlobalState;
  subscriptionsCache: {
    [S in keyof SubscriptionEventMap]?: Parameters<SubscriptionEventMap[S]>[0];
  };
  subscriptionsEventEmitter: TypedEmitter<SubscriptionEventMap>;
};
