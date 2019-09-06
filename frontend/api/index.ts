import getConfig from "next/config";

import autobahn from "autobahn";

interface IPromisePair {
  resolve: (value?: autobahn.Session) => void;
  reject: (value?: string) => void;
}

const awaitingOnSession: Array<IPromisePair> = [];

const subscriptions: Record<
  string,
  [autobahn.SubscribeHandler, autobahn.ISubscribeOptions | undefined]
> = {};

let wampNearExplorerUrl: string, wampNearExplorerSecret: string;

if (typeof window === "undefined") {
  const { serverRuntimeConfig } = getConfig();
  wampNearExplorerUrl = serverRuntimeConfig.wampNearExplorerUrl;
  wampNearExplorerSecret = serverRuntimeConfig.wampNearExplorerFrontendSecret;
} else {
  const { publicRuntimeConfig } = getConfig();
  wampNearExplorerUrl = publicRuntimeConfig.wampNearExplorerUrl;
  wampNearExplorerSecret = publicRuntimeConfig.wampNearExplorerFrontendSecret;
}

const wamp = new autobahn.Connection({
  url: wampNearExplorerUrl,
  realm: "near-explorer",
  authmethods: ["ticket"],
  authid: "near-explorer-frontend",
  onchallenge: (_session, method, _extra) => {
    if (method === "ticket") {
      return wampNearExplorerSecret;
    }
    throw "unsupported challenge method";
  },
  retry_if_unreachable: true,
  max_retries: Number.MAX_SAFE_INTEGER,
  max_retry_delay: 10
});

// Establish and handle concurrent requests to establish WAMP connection.
function getWampSession(): Promise<autobahn.Session> {
  return new Promise(
    (
      resolve: (value?: autobahn.Session) => void,
      reject: (value?: string) => void
    ) => {
      if (wamp.transport.info.type === "websocket") {
        // The connection is open/opening
        if (wamp.session && wamp.session.isOpen) {
          // Resolve the established session as it is ready
          resolve(wamp.session);
        } else {
          // Push the promise resolvers on a queue
          awaitingOnSession.push({ resolve, reject });
        }
      } else {
        // Establish new session
        awaitingOnSession.push({ resolve, reject });

        wamp.onopen = session => {
          Object.entries(subscriptions).forEach(([topic, [handler, options]]) =>
            session.subscribe(topic, handler, options)
          );
          while (awaitingOnSession.length > 0) {
            awaitingOnSession.pop()!.resolve(session);
          }
        };

        wamp.onclose = reason => {
          while (awaitingOnSession.length > 0) {
            awaitingOnSession.pop()!.reject(reason);
          }
          return false;
        };

        wamp.open();
      }
    }
  );
}

export async function subscribe(
  topic: string,
  handler: autobahn.SubscribeHandler,
  options?: autobahn.ISubscribeOptions
): Promise<autobahn.ISubscription> {
  if (topic[0] === ".") {
    topic = "com.nearprotocol.explorer" + topic;
  }
  subscriptions[topic] = [handler, options];
  const session = await getWampSession();
  return await session.subscribe(topic, handler, options);
}

export async function call(
  procedure: string,
  args?: any[] | any,
  kwargs?: any,
  options?: autobahn.ICallOptions
): Promise<unknown> {
  if (procedure[0] === ".") {
    procedure = "com.nearprotocol.explorer" + procedure;
  }
  const session = await getWampSession();
  return await session.call(procedure, args, kwargs, options);
}
