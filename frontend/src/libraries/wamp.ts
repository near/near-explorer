import autobahn from "autobahn-browser";
import { getConfig } from "./config";
import { getBackendUrl, wrapProcedure, wrapTopic } from "./common";
import {
  SubscriptionTopicType,
  SubscriptionTopicTypes,
  ProcedureArgs,
  ProcedureResult,
  ProcedureType,
  NetworkName,
} from "../types/common";

let sessionPromise: Promise<autobahn.Session> | undefined;

const createSession = async (): Promise<autobahn.Session> => {
  return new Promise((resolve, reject) => {
    const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();
    console.log("Starting WAMP session...");
    const connection = new autobahn.Connection({
      url: getBackendUrl(
        (typeof window === "undefined"
          ? serverRuntimeConfig
          : publicRuntimeConfig
        ).backendConfig
      ),
      realm: "near-explorer",
      retry_if_unreachable: true,
      max_retries: Number.MAX_SAFE_INTEGER,
      max_retry_delay: 10,
    });
    connection.onopen = (session) => {
      console.log("WAMP session started");
      resolve(session);
    };
    connection.onclose = (reason) => {
      console.log("WAMP session closed");
      reject(reason);
      return false;
    };
    connection.open();
  });
};

const getSession = async (): Promise<autobahn.Session> => {
  if (!sessionPromise) {
    sessionPromise = createSession();
  }
  const session = await sessionPromise;
  if (!session.isOpen) {
    sessionPromise = createSession();
  }
  return sessionPromise;
};

type CachedItem<T extends SubscriptionTopicType> = {
  subscription?: autobahn.ISubscription;
  lastValue?: SubscriptionTopicTypes[T];
};

// We keep cache to update newly subscribed handlers immediately
let subscriptionCache: Partial<
  {
    [T in SubscriptionTopicType]: CachedItem<T>;
  }
> = {};

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
  subscriptionCache[
    wrappedTopic
  ] = cachedItem as typeof subscriptionCache[typeof wrappedTopic];
  const session = await getSession();
  cachedItem.subscription = await session.subscribe(
    wrappedTopic,
    (_args, kwargs) => {
      handler(kwargs);
      const cachedTopic = subscriptionCache[wrappedTopic];
      if (!cachedTopic) {
        // Bail-out in case we have a race condition of this callback and unsubscription
        return;
      }
      cachedTopic.lastValue = kwargs;
    }
  );
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
  return subscriptionCache[wrapTopic(networkName, topic)]?.lastValue as
    | SubscriptionTopicTypes[T]
    | undefined;
};

export const fetch = async <P extends ProcedureType>(
  procedure: P,
  networkName: NetworkName,
  args: ProcedureArgs<P>
): Promise<ProcedureResult<P>> => {
  const session = await getSession();
  const result = await session.call(
    wrapProcedure(networkName, procedure),
    args
  );
  return result as ProcedureResult<P>;
};
