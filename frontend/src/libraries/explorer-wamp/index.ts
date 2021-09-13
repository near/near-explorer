import getConfig from "next/config";

import autobahn from "autobahn";

import { getNearNetwork, NearNetwork } from "../config";

interface IPromisePair {
  resolve: (value: autobahn.Session) => void;
  reject: (value?: string) => void;
}

export class ExplorerApi {
  static awaitingOnSession: Array<IPromisePair> = [];

  static subscriptions: Record<
    string,
    {
      handler: autobahn.SubscribeHandler;
      options?: autobahn.ISubscribeOptions;
      subscription?: autobahn.Subscription;
    }
  > = {};

  static wamp: autobahn.Connection;

  dataSource: string;
  nearNetwork: NearNetwork;

  constructor(apiPrefixSource?: any) {
    const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

    this.dataSource = publicRuntimeConfig.nearExplorerDataSource;

    if (ExplorerApi.wamp === undefined) {
      let wampNearExplorerUrl: string;
      if (typeof window === "undefined") {
        wampNearExplorerUrl = serverRuntimeConfig.wampNearExplorerUrl;
      } else {
        wampNearExplorerUrl = publicRuntimeConfig.wampNearExplorerUrl;
      }

      ExplorerApi.wamp = new autobahn.Connection({
        url: wampNearExplorerUrl,
        realm: "near-explorer",
        retry_if_unreachable: true,
        max_retries: Number.MAX_SAFE_INTEGER,
        max_retry_delay: 10,
      });
    }

    let explorerHostname: string;
    if (apiPrefixSource === undefined) {
      if (typeof location === "undefined") {
        throw Error(
          "DevHint: You must provide `apiPrefixSource` argument to Explorer API constructor if you instantiate it on the server side."
        );
      }
      explorerHostname = location.host;
    } else if (typeof apiPrefixSource === "string") {
      explorerHostname = apiPrefixSource;
    } else if ("socket" in apiPrefixSource) {
      explorerHostname = apiPrefixSource.headers.host;
    } else {
      throw Error(
        `Unknown apiPrefixSource ${apiPrefixSource} (of type ${typeof apiPrefixSource})`
      );
    }

    this.nearNetwork = getNearNetwork(explorerHostname);
  }

  // Establish and handle concurrent requests to establish WAMP connection.
  static getWampSession(): Promise<autobahn.Session> {
    return new Promise(
      (
        resolve: (value: autobahn.Session) => void,
        reject: (value?: string) => void
      ) => {
        if (ExplorerApi.wamp.transport.info.type === "websocket") {
          // The connection is open/opening
          if (ExplorerApi.wamp.session && ExplorerApi.wamp.session.isOpen) {
            // Resolve the established session as it is ready
            resolve(ExplorerApi.wamp.session);
          } else {
            // Push the promise resolvers on a queue
            ExplorerApi.awaitingOnSession.push({ resolve, reject });
          }
        } else {
          // Establish new session
          ExplorerApi.awaitingOnSession.push({ resolve, reject });

          ExplorerApi.wamp.onopen = (session: autobahn.Session) => {
            Object.entries(
              ExplorerApi.subscriptions
            ).forEach(([topic, { handler, options }]) =>
              session.subscribe(topic, handler, options)
            );
            while (ExplorerApi.awaitingOnSession.length > 0) {
              ExplorerApi.awaitingOnSession.pop()!.resolve(session);
            }
          };

          ExplorerApi.wamp.onclose = (reason) => {
            while (ExplorerApi.awaitingOnSession.length > 0) {
              ExplorerApi.awaitingOnSession.pop()!.reject(reason);
            }
            return false;
          };

          ExplorerApi.wamp.open();
        }
      }
    );
  }

  async subscribe(
    topic: string,
    handler: autobahn.SubscribeHandler,
    options?: autobahn.ISubscribeOptions
  ): Promise<autobahn.ISubscription> {
    topic = `com.nearprotocol.${this.nearNetwork.name}.explorer.${topic}`;
    ExplorerApi.subscriptions[topic] = { handler, options };
    const session = await ExplorerApi.getWampSession();
    const subscription = await session.subscribe(topic, handler, options);
    ExplorerApi.subscriptions[topic].subscription = subscription;
    return subscription;
  }

  async unsubscribe(
    topic: string
  ): Promise<autobahn.ISubscription | undefined> {
    topic = `com.nearprotocol.${this.nearNetwork.name}.explorer.${topic}`;
    const subscription = ExplorerApi.subscriptions[topic]?.subscription;
    delete ExplorerApi.subscriptions[topic];
    const session = await ExplorerApi.getWampSession();
    if (!subscription) {
      return;
    }
    return await session.unsubscribe(subscription);
  }

  async call<T>(
    procedure: string,
    args?: any[] | any,
    kwargs?: any,
    options?: autobahn.ICallOptions
  ): Promise<T> {
    procedure = `com.nearprotocol.${this.nearNetwork.name}.explorer.${procedure}`;
    const session = await ExplorerApi.getWampSession();
    return (await session.call(procedure, args, kwargs, options)) as T;
  }
}

export function instrumentTopicNameWithDataSource(topicName: string) {
  return `${topicName}:${new ExplorerApi().dataSource}`;
}
