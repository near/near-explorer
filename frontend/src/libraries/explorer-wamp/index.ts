import getConfig from "next/config";

import autobahn from "autobahn";

interface IPromisePair {
  resolve: (value?: autobahn.Session) => void;
  reject: (value?: string) => void;
}

export class ExplorerApi {
  static awaitingOnSession: Array<IPromisePair> = [];

  static subscriptions: Record<
    string,
    [autobahn.SubscribeHandler, autobahn.ISubscribeOptions | undefined]
  > = {};

  static wamp: autobahn.Connection;

  apiPrefix: string;

  constructor(apiPrefixSource?: any) {
    const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

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
        max_retry_delay: 10
      });
    }

    if (apiPrefixSource === undefined) {
      this.apiPrefix = location.host;
    } else if (typeof apiPrefixSource === "string") {
      this.apiPrefix = apiPrefixSource;
    } else if ("socket" in apiPrefixSource) {
      this.apiPrefix = apiPrefixSource.headers.host;
    } else {
      throw Error(
        `Unknown apiPrefixSource ${apiPrefixSource} (of type ${typeof apiPrefixSource})`
      );
    }

    const { nearNetworkAliases } = publicRuntimeConfig;
    if (this.apiPrefix in nearNetworkAliases) {
      this.apiPrefix = nearNetworkAliases[this.apiPrefix].name;
    }
  }

  // Establish and handle concurrent requests to establish WAMP connection.
  static getWampSession(): Promise<autobahn.Session> {
    return new Promise(
      (
        resolve: (value?: autobahn.Session) => void,
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

          ExplorerApi.wamp.onopen = session => {
            Object.entries(ExplorerApi.subscriptions).forEach(
              ([topic, [handler, options]]) =>
                session.subscribe(topic, handler, options)
            );
            while (ExplorerApi.awaitingOnSession.length > 0) {
              ExplorerApi.awaitingOnSession.pop()!.resolve(session);
            }
          };

          ExplorerApi.wamp.onclose = reason => {
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
    topic = `com.nearprotocol.${this.apiPrefix}.explorer.${topic}`;
    ExplorerApi.subscriptions[topic] = [handler, options];
    const session = await ExplorerApi.getWampSession();
    return await session.subscribe(topic, handler, options);
  }

  async call<T>(
    procedure: string,
    args?: any[] | any,
    kwargs?: any,
    options?: autobahn.ICallOptions
  ): Promise<T> {
    procedure = `com.nearprotocol.${this.apiPrefix}.explorer.${procedure}`;
    const session = await ExplorerApi.getWampSession();
    return (await session.call(procedure, args, kwargs, options)) as T;
  }
}
