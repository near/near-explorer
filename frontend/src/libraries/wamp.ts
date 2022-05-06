import autobahn from "autobahn";
import { getConfig, NearNetwork } from "./config";
import { getBackendUrl } from "./environment";
import {
  SubscriptionTopicType,
  SubscriptionTopicTypes,
} from "../types/subscriptions";
import {
  ProcedureArgs,
  ProcedureResult,
  ProcedureType,
} from "../types/procedures";

const wrapTopic = <T extends SubscriptionTopicType>(
  nearNetwork: NearNetwork,
  topic: T
): T => {
  // That's unfair as we actually change topic name
  // But the types match so we'll keep it
  return (`com.nearprotocol.${nearNetwork.name}.explorer.${topic}` as unknown) as T;
};

const wrapProcedure = <T extends ProcedureType>(
  nearNetwork: NearNetwork,
  procedure: T
): T => {
  // That's unfair as we actually change procedure name
  // But the types match so we'll keep it
  return (`com.nearprotocol.${nearNetwork.name}.explorer.${procedure}` as unknown) as T;
};

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
  nearNetwork: NearNetwork,
  handler: (data: SubscriptionTopicTypes[T]) => void
): Promise<void> => {
  const wrappedTopic = wrapTopic(nearNetwork, topic);
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
  nearNetwork: NearNetwork
): Promise<void> => {
  const wrappedTopic = wrapTopic(nearNetwork, topic);
  const cacheItem = subscriptionCache[wrappedTopic];
  if (!cacheItem) {
    return;
  }
  delete subscriptionCache[wrappedTopic];
  await cacheItem.subscription?.unsubscribe();
};

export const getLastValue = <T extends SubscriptionTopicType>(
  topic: T,
  nearNetwork: NearNetwork
): SubscriptionTopicTypes[T] | undefined => {
  return subscriptionCache[wrapTopic(nearNetwork, topic)]?.lastValue as
    | SubscriptionTopicTypes[T]
    | undefined;
};

export const fetch = async <P extends ProcedureType>(
  procedure: P,
  nearNetwork: NearNetwork,
  args: ProcedureArgs<P>
): Promise<ProcedureResult<P>> => {
  const session = await getSession();
  const result = await session.call(
    wrapProcedure(nearNetwork, procedure),
    args
  );
  return result as ProcedureResult<P>;
};
