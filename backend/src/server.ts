import * as trpcExpress from "@trpc/server/adapters/express";
import * as trpcWsAdapter from "@trpc/server/adapters/ws";
import cors from "cors";
import express, { ErrorRequestHandler } from "express";
import http from "http";
import stream from "stream";
import ws from "ws";

import { AppRouter } from "@explorer/backend/router";
import { getMissingSubscriptionCacheKeys } from "@explorer/backend/utils/cache";
import { escapeHtml } from "@explorer/backend/utils/html";

export type RouterOptions = Parameters<
  typeof trpcExpress.createExpressMiddleware<AppRouter>
>[0];

export type WebsocketRouterOptions = Omit<
  trpcWsAdapter.WSSHandlerOptions<AppRouter>,
  "wss"
>;

// Function has to has 4 arguments for express to consider it an error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const error = `Error on ${req.url}\n${String(err)}${
    err.stack ? `\n${err.stack}` : ""
  }`;
  // eslint-disable-next-line no-console
  console.error(error);
  res.status(500).send(escapeHtml(error));
};

export const createApp = (options: RouterOptions) => {
  const app = express();

  app
    .use(cors())
    .use("/trpc", trpcExpress.createExpressMiddleware(options))
    .use("/ping", (_req, res) => res.send("OK"))
    .use("/global-state", async (req, res) => {
      const context = await options.createContext({ req, res });
      const missingGlobalStateKeys = getMissingSubscriptionCacheKeys(context);
      if (missingGlobalStateKeys.length === 0) {
        res.send("Ready!");
      } else {
        res
          .status(500)
          .send(
            `Missing global state keys: ${missingGlobalStateKeys.join(", ")}`
          );
      }
    })
    .use(errorHandler);

  return app;
};

export const connectWebsocketServer = (
  server: http.Server,
  options: WebsocketRouterOptions
) => {
  const websocketServer = new ws.Server({
    noServer: true,
    path: "/ws",
  });

  const handler = trpcWsAdapter.applyWSSHandler({
    wss: websocketServer,
    ...options,
  });

  const onUpgrade = (
    request: http.IncomingMessage,
    socket: stream.Duplex,
    head: Buffer
  ) => {
    websocketServer.handleUpgrade(request, socket, head, (websocket) => {
      websocketServer.emit("connection", websocket, request);
    });
  };
  server.on("upgrade", onUpgrade);

  return async () => {
    server.off("upgrade", onUpgrade);
    handler.broadcastReconnectNotification();
    return new Promise<void>((resolve, reject) => {
      websocketServer.close((error) => (error ? reject(error) : resolve()));
    });
  };
};
