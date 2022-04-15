import uWS from "uWebSockets.js";
import {
  IncomingMessage,
  OutcomingMessage,
  SubscriptionTopicType,
  SubscriptionTopicTypes,
  wrapTopic,
} from "./client-types";
import { wampNearNetworkName } from "./config";
import { handlers } from "./handlers";

const textDecoder = new TextDecoder("utf8");

const PORT = 10000;

export const setupWebsocket = (): uWS.TemplatedApp => {
  let connected = 0;
  let app = uWS.App().ws("/ws", {
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
  });

  app = Object.entries(handlers).reduce((app, [key, handler]) => {
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
        const result = await handler(args);
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

  return app
    .any("/*", (res) => {
      res.writeStatus("404").end();
    })
    .listen(PORT, (token) => {
      if (token) {
        console.log("uWS listening to port " + PORT, token);
      } else {
        console.log("uWS failed to listen to port " + PORT);
      }
    });
};

export const publish = <T extends SubscriptionTopicType>(
  topic: T,
  namedArgs: SubscriptionTopicTypes[T],
  app: uWS.TemplatedApp
) => {
  try {
    const wrappedTopic = wrapTopic(topic, wampNearNetworkName);
    const publishMessage: IncomingMessage<T> = [wrappedTopic, namedArgs];
    app.publish(wrappedTopic, JSON.stringify(publishMessage));
  } catch (e) {
    console.error(`${topic} publishing failed.\n${e}\n${new Error().stack}`);
  }
};
