import uWS from "uWebSockets.js";
import { GlobalState } from "./checks";
import {
  OutcomingMessage,
  SubscriptionTopicType,
  SubscriptionTopicTypes,
} from "./types";
import { config } from "./config";
import { wrapTopic } from "./common";
import { procedureHandlers } from "./procedure-handlers";

export type PubSubController = {
  publish: <T extends SubscriptionTopicType>(
    topic: T,
    namedArgs: SubscriptionTopicTypes[T]
  ) => Promise<void>;
};

const textDecoder = new TextDecoder("utf8");

export const initPubSub = (state: GlobalState): PubSubController => {
  let connected = 0;
  let app = uWS
    .App()
    .ws("/ws", {
      compression: uWS.SHARED_COMPRESSOR,
      maxPayloadLength: 16 * 1024 * 1024,
      idleTimeout: 0,

      open: () => {
        connected++;
      },
      close: () => {
        connected--;
      },
      message: (ws, rawMessage) => {
        const [type, topic]: OutcomingMessage = JSON.parse(
          textDecoder.decode(rawMessage)
        );
        switch (type) {
          case "sub":
            return ws.subscribe(topic);
          case "unsub":
            return ws.unsubscribe(topic);
        }
      },
    })
    .get("/ping", (res) => res.end("OK"));

  app = Object.entries(procedureHandlers).reduce((app, [key, handler]) => {
    return app.post("/" + key, async (res) => {
      res.onAborted(() => {
        return;
      });
      try {
        const data = await new Promise<Buffer>((resolve) => {
          let data = Buffer.from("");
          res.onData((chunk, isLast) => {
            data = Buffer.concat([data, Buffer.from(chunk)]);
            if (isLast) {
              resolve(data);
            }
          });
        });
        const args = JSON.parse(data.toString("utf8"));
        const result = await handler(args, state);
        res.writeHeader("Access-Control-Allow-Origin", "*");
        res.writeStatus("200").end(JSON.stringify(result));
      } catch (e) {
        res.writeStatus("500").end(JSON.stringify({ error: e }));
      }
    });
  }, app);

  setInterval(() => {
    console.log("Connections amount:", connected);
  }, 2500);

  const startPromise = new Promise<void>((resolve, reject) => {
    const pubSubPort = config.port;
    app
      .any("/*", (res) => {
        res.writeStatus("404").end();
      })
      .listen(pubSubPort, (token) => {
        if (token) {
          console.log("uWS listening to port " + pubSubPort, token);
          resolve();
        } else {
          console.log("uWS failed to listen to port " + pubSubPort);
          reject();
        }
      });
  });
  return {
    publish: async (topic, namedArgs) => {
      await startPromise;
      try {
        const wrappedTopic = wrapTopic(config.networkName, topic);
        const publishMessage = [wrappedTopic, namedArgs];
        app.publish(wrappedTopic, JSON.stringify(publishMessage));
      } catch (e) {
        console.error(
          `${topic} publishing failed.\n${e}\n${new Error().stack}`
        );
      }
    },
  };
};
