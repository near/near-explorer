import ReconnectingWebSocket from "reconnecting-websocket";
import { getConfig } from "./config";
import {
  IncomingMessage,
  OutcomingMessage,
  SubscriptionTopicType,
  SubscriptionTopicTypes,
} from "../types/common";
import { wrapTopic } from "./common";
import { NetworkName } from "../types/common";

type UnsubscribeFn = () => void;

type CachedItem<T extends SubscriptionTopicType> = {
  subscription?: {
    handler: (data: SubscriptionTopicTypes[T]) => void;
    unsubscribe: UnsubscribeFn;
  };
  lastValue?: SubscriptionTopicTypes[T];
};

type Session = {
  subscribe: <T extends SubscriptionTopicType>(topic: T) => void;
};

const sessions: Partial<Record<NetworkName, Session>> = {};
// We keep cache to update newly subscribed handlers immediately
let subscriptionCache: Partial<
  {
    [T in SubscriptionTopicType]: CachedItem<T>;
  }
> = {};

const getSession = (networkName: NetworkName): Session => {
  if (!sessions[networkName]) {
    const {
      publicRuntimeConfig: { backendConfig },
    } = getConfig();
    if (!backendConfig.hosts[networkName]) {
      throw new Error(`Network ${networkName} is not supported on this host`);
    }
    const url = `${backendConfig.secure ? "wss" : "ws"}://${
      backendConfig.hosts[networkName]
    }:${backendConfig.port}/ws`;
    const ws = new ReconnectingWebSocket(url);
    ws.addEventListener(
      "message",
      <T extends SubscriptionTopicType>(event: MessageEvent) => {
        const [topic, data] = JSON.parse(event.data) as IncomingMessage<T>;
        const cacheItem = subscriptionCache[topic];
        if (cacheItem) {
          cacheItem.lastValue = data;
          const subscription = cacheItem.subscription;
          if (subscription) {
            // TODO: fix types
            subscription.handler(data as any);
          }
        }
      }
    );
    // reconnect
    ws.addEventListener("open", () =>
      Object.keys(subscriptionCache).forEach((cachedTopic) =>
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
    sessions[networkName] = {
      subscribe: (topic) => {
        sendMessage(["sub", topic]);
        return () => sendMessage(["unsub", topic]);
      },
    };
  }
  return sessions[networkName]!;
};

export const subscribeTopic = async <T extends SubscriptionTopicType>(
  topic: T,
  networkName: NetworkName,
  handler: (data: SubscriptionTopicTypes[T]) => void
): Promise<void> => {
  const wrappedTopic = wrapTopic(networkName, topic);
  if (subscriptionCache[wrappedTopic]) {
    return;
  }
  const cachedItem: CachedItem<T> = {};
  // TODO: fix types
  subscriptionCache[wrappedTopic] = cachedItem as any;
  const session = getSession(networkName);
  cachedItem.subscription = {
    handler: (data) => {
      handler(data);
      const cachedTopic = subscriptionCache[wrappedTopic];
      if (!cachedTopic) {
        // Bail-out in case we have a race condition of this callback and unsubscription
        return;
      }
      cachedTopic.lastValue = data;
    },
    unsubscribe: () => session.subscribe(wrappedTopic),
  };
};

export const unsubscribeTopic = async <T extends SubscriptionTopicType>(
  topic: T,
  networkName: NetworkName
): Promise<void> => {
  const wrappedTopic = wrapTopic(networkName, topic);
  const cacheItem = subscriptionCache[wrappedTopic];
  if (!cacheItem) {
    return;
  }
  delete subscriptionCache[wrappedTopic];
  await cacheItem.subscription?.unsubscribe();
};

export const getLastValue = <T extends SubscriptionTopicType>(
  topic: T,
  networkName: NetworkName
): SubscriptionTopicTypes[T] | undefined => {
  const wrappedTopic = wrapTopic(networkName, topic);
  const cacheItem = subscriptionCache[wrappedTopic];
  if (!cacheItem) {
    return;
  }
  // TODO: fix types
  return (cacheItem as any).lastValue;
};
