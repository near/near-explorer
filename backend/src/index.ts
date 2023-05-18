import { EventEmitter } from "events";

import { config } from "@/backend/config";
import { Context } from "@/backend/context";
import { runTasks } from "@/backend/cron";
import { initGlobalState } from "@/backend/global-state";
import { AppRouter, router } from "@/backend/router";
import {
  connectWebsocketServer,
  createApp,
  RouterOptions,
  WebsocketRouterOptions,
} from "@/backend/server";
import { onError } from "@/backend/utils/error";
import { setupTelemetryDb } from "@/backend/utils/telemetry";

async function main(appRouter: AppRouter): Promise<void> {
  // eslint-disable-next-line no-console
  console.log("Starting Explorer backend...");
  const context: Context = {
    state: initGlobalState(),
    subscriptionsCache: {},
    subscriptionsEventEmitter:
      new EventEmitter() as Context["subscriptionsEventEmitter"],
  };

  // We subscribe to the emitter on every client subscriber
  // Therefore we set max listeners to limit to infinity
  context.subscriptionsEventEmitter.setMaxListeners(0);
  const trpcOptions: RouterOptions & WebsocketRouterOptions = {
    router: appRouter,
    createContext: ({ req, res }) => ({ ...context, req, res }),
    onError,
  };

  const app = createApp(trpcOptions);

  const server = app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${config.port}`);
  });

  const shutdownHandlers: (() => Promise<void> | void)[] = [];

  shutdownHandlers.push(connectWebsocketServer(server, trpcOptions));
  if (!config.offline) {
    await setupTelemetryDb();
    shutdownHandlers.push(runTasks(context));
  }

  const closeServer = () =>
    new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });

  const gracefulShutdown = async (signal: NodeJS.Signals) => {
    // eslint-disable-next-line no-console
    console.log(`Got ${signal} signal, shutting down`);
    try {
      await Promise.all([
        closeServer(),
        shutdownHandlers.map((handler) => handler()),
      ]);
      // eslint-disable-next-line no-console
      console.log("Shut down gracefully");
      process.exit(0);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Error on server close", e);
      // eslint-disable-next-line no-console
      console.log("Shut down with error");
      process.exit(1);
    }
  };
  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);

  // eslint-disable-next-line no-console
  console.log("Explorer backend started");
}

void main(router);
