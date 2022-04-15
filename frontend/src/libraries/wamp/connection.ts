import ReconnectingWebSocket from "reconnecting-websocket";
import { getConfig, NearNetwork } from "../config";
import {
  IncomingMessage,
  OutcomingMessage,
  SubscriptionTopicType,
  SubscriptionTopicTypes,
} from "./types";
import { wrapTopic } from "./utils";

type UnsubscribeFn = () => void;
// We keep cache to update newly subscribed handlers immediately
type SubscriptionCache = Partial<
  {
    [T in SubscriptionTopicType]: {
      subscription: (data: SubscriptionTopicTypes[T]) => void;
      lastValue?: SubscriptionTopicTypes[T];
      unsubscribe: UnsubscribeFn;
    };
  }
>;
type Session = {
  subscribe: <T extends SubscriptionTopicType>(topic: T) => void;
  cache: SubscriptionCache;
};

let session: Session;
let cache: SubscriptionCache = {};

const getSession = (): Session => {
  if (!session) {
    const {
      publicRuntimeConfig: { backendConfig },
    } = getConfig();
    const url = `${backendConfig.secure ? "wss" : "ws"}://${
      backendConfig.host
    }:${backendConfig.port}/ws`;
    const ws = new ReconnectingWebSocket(url);
    ws.addEventListener(
      "message",
      <T extends SubscriptionTopicType>(event: MessageEvent) => {
        const [topic, data] = JSON.parse(event.data) as IncomingMessage<T>;
        const cachedTopicHandler = cache[topic];
        if (cachedTopicHandler) {
          cachedTopicHandler.lastValue = data;
          cachedTopicHandler.subscription(data as any);
        }
      }
    );
    // reconnect
    ws.addEventListener("open", () =>
      Object.keys(cache).forEach((cachedTopic) =>
        sendMessage(["sub", cachedTopic as SubscriptionTopicType])
      )
    );
    const sendMessage = (message: OutcomingMessage) => {
      if (ws.readyState !== 1) {
        return;
      }
      const [type, topic] = message;
      ws.send(JSON.stringify([type, topic]));
    };
    session = {
      subscribe: (topic) => {
        sendMessage(["sub", topic]);
        return () => sendMessage(["unsub", topic]);
      },
      cache,
    };
  }
  return session;
};

export const subscribeTopic = async <T extends SubscriptionTopicType>(
  topic: T,
  nearNetwork: NearNetwork,
  handler: (data: SubscriptionTopicTypes[T]) => void
): Promise<void> => {
  const wrappedTopic = wrapTopic(topic, nearNetwork.name);
  const session = getSession();
  if (session.cache[wrappedTopic]) {
    return;
  }
  const unsubscribe = session.subscribe(wrappedTopic);
  session.cache[wrappedTopic] = ({
    subscription: handler,
    lastValue: null,
    unsubscribe,
  } as unknown) as SubscriptionCache[typeof wrappedTopic];
};

export const unsubscribeTopic = async <T extends SubscriptionTopicType>(
  topic: T,
  nearNetwork: NearNetwork
): Promise<void> => {
  const wrappedTopic = wrapTopic(topic, nearNetwork.name);
  const session = getSession();
  const topicCache = session.cache[wrappedTopic];
  if (!topicCache) {
    return;
  }
  topicCache.unsubscribe();
  delete session.cache[wrappedTopic];
};

export const getLastValue = <T extends SubscriptionTopicType>(
  topic: T,
  nearNetwork: NearNetwork
): SubscriptionTopicTypes[T] | undefined => {
  const wrappedTopic = wrapTopic(topic, nearNetwork.name);
  const session = getSession();
  return session.cache[wrappedTopic]?.lastValue as
    | SubscriptionTopicTypes[T]
    | undefined;
};
