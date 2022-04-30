import autobahn from "autobahn";
import EventEmitter from "events";

import { SubscriptionTopicType, SubscriptionTopicTypes } from "./client-types";

import {
  nearNetworkName,
  wampNearExplorerUrl,
  wampNearExplorerBackendSecret,
} from "./config";
import { GlobalState } from "./checks";
import { SECOND } from "./consts";
import { procedureHandlers } from "./procedure-handlers";

export type PubSubController = {
  publish: <T extends SubscriptionTopicType>(
    topic: T,
    namedArgs: SubscriptionTopicTypes[T]
  ) => Promise<void>;
};

export const initPubSub = (state: GlobalState): PubSubController => {
  console.log(
    `WAMP setup: connecting to ${wampNearExplorerUrl} with ticket ${wampNearExplorerBackendSecret}`
  );
  const wamp = new autobahn.Connection({
    realm: "near-explorer",
    transports: [
      {
        url: wampNearExplorerUrl,
        type: "websocket",
      },
    ],
    authmethods: ["ticket"],
    authid: "near-explorer-backend",
    onchallenge: (_session, method) => {
      if (method === "ticket") {
        return wampNearExplorerBackendSecret;
      }
      throw "WAMP authentication error: unsupported challenge method";
    },
    retry_if_unreachable: true,
    max_retries: Number.MAX_SAFE_INTEGER,
    max_retry_delay: 10,
  });

  let currentSessionPromise: Promise<autobahn.Session>;
  const openEventEmitter = new EventEmitter();

  wamp.onopen = async (session) => {
    openEventEmitter.emit("opened", session);
    currentSessionPromise = Promise.resolve(session);
    console.log("WAMP connection is established. Waiting for commands...");

    for (const [name, handler] of Object.entries(procedureHandlers)) {
      const uri = `com.nearprotocol.${nearNetworkName}.explorer.${name}`;
      try {
        await session.register(uri, (args: any) => handler(args, state));
      } catch (error) {
        console.error(`Failed to register "${uri}" handler due to:`, error);
        wamp.close();
        setTimeout(() => {
          wamp.open();
        }, SECOND);
        return;
      }
    }
  };

  wamp.onclose = (reason) => {
    currentSessionPromise = new Promise((resolve) => {
      openEventEmitter.addListener("opened", resolve);
    });
    console.log(
      "WAMP connection has been closed (check WAMP router availability and credentials):",
      reason
    );
    return false;
  };

  wamp.open();
  return {
    publish: async (topic, namedArgs) => {
      try {
        const uri = `com.nearprotocol.${nearNetworkName}.explorer.${topic}`;
        const session = await currentSessionPromise;
        if (!session.isOpen) {
          console.log(`No session on stack\n${new Error().stack}`);
          return;
        }
        session.publish(uri, [], namedArgs);
      } catch (e) {
        console.error(
          `${topic} publishing failed.\n${e}\n${new Error().stack}`
        );
      }
    },
  };
};
