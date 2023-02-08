import * as trpcExpress from "@trpc/server/adapters/express";
import * as trpcWsAdapter from "@trpc/server/adapters/ws";
import { NodeHTTPCreateContextOption } from "@trpc/server/dist/declarations/src/adapters/node-http";
import { HTTPBaseHandlerOptions } from "@trpc/server/dist/declarations/src/http/internals/types";
import cors from "cors";
import express, { ErrorRequestHandler } from "express";
import http from "http";
import stream from "stream";
import ws from "ws";

import { AppRouter } from "@explorer/backend/router";
import { escapeHtml } from "@explorer/backend/utils/html";

export type RouterOptions = HTTPBaseHandlerOptions<
  AppRouter,
  http.IncomingMessage
> &
  NodeHTTPCreateContextOption<AppRouter, http.IncomingMessage, unknown>;

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
    .use(errorHandler);

  return app;
};

export const connectWebsocketServer = (
  server: http.Server,
  options: RouterOptions
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

  return () => {
    server.off("upgrade", onUpgrade);
    handler.broadcastReconnectNotification();
  };
};
