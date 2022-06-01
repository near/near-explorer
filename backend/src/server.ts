import * as trpcExpress from "@trpc/server/adapters/express";
import * as trpcWsAdapter from "@trpc/server/adapters/ws";
import http from "http";
import stream from "stream";
import ws from "ws";
import express from "express";
import cors from "cors";
import { AppRouter } from "./router";
import { Context } from "./context";

type RouterOptions = {
  router: AppRouter;
  createContext: () => Context;
};

export const createApp = (options: RouterOptions) => {
  const app = express();

  app
    .use(cors())
    .use("/trpc", trpcExpress.createExpressMiddleware(options))
    .use("/ping", (_req, res) => res.send("OK"));

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
