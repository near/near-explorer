import * as trpcExpress from "@trpc/server/adapters/express";
import * as trpcWsAdapter from "@trpc/server/adapters/ws";
import { NodeHTTPHandlerOptions } from "@trpc/server/dist/declarations/src/adapters/node-http";
import { Registry } from "prom-client";
import http from "http";
import stream from "stream";
import ws from "ws";
import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import { AppRouter } from "./router";
import { escapeHtml } from "./utils/html";
import { getMetricsHandler } from "../../common/src/utils/logging";

type RouterOptions =
  | NodeHTTPHandlerOptions<AppRouter, express.Request, express.Response> &
      Omit<trpcWsAdapter.WSSHandlerOptions<AppRouter>, "wss">;

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const error = `Error on ${req.url}\n${String(err)}${
    err.stack ? `\n${err.stack}` : ""
  }`;
  console.error(error);
  res.status(500).send(escapeHtml(error));
};

export const createApp = (options: RouterOptions, registry: Registry) => {
  const app = express();

  app
    .use(cors())
    .use("/metrics", getMetricsHandler(registry))
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
