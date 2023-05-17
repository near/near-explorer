import type express from "express";
import type http from "http";
import type TypedEmitter from "typed-emitter";
import type ws from "ws";

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

export type RequestContext = Context & {
  req: express.Request | http.IncomingMessage;
  res: express.Response | ws.WebSocket;
};
