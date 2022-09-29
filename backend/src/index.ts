import * as trpc from "@trpc/server";
import { EventEmitter } from "events";
import prometheus from "prom-client";
import { setupTelemetryDb } from "./utils/telemetry";
import { runTasks } from "./cron";
import { AppRouter, router } from "./router";
import { connectWebsocketServer, createApp } from "./server";
import { config } from "./config";
import { initGlobalState } from "./global-state";
import { Context } from "./context";
import { createLogging } from "../../common/src/utils/logging";
import { startPrometheusPush } from "../../common/src/utils/prometheus";

const backendRegistry = new prometheus.Registry();

async function main(router: AppRouter): Promise<void> {
  console.log("Starting Explorer backend...");
  const context: Context = {
    state: initGlobalState(),
    subscriptionsCache: {},
    subscriptionsEventEmitter:
      new EventEmitter() as Context["subscriptionsEventEmitter"],
  };
  const logging = await createLogging(backendRegistry);

  // We subscribe to the emitter on every client subscriber
  // Therefore we set max listeners to limit to infinity
  context.subscriptionsEventEmitter.setMaxListeners(0);
  const trpcOptions = {
    router: trpc
      .router<Context>()
      .middleware(async ({ path, type, next }) => {
        const startTimestamp = Date.now();
        logging.onRequest({ network: config.networkName, method: type, path });
        const result = await next();
        logging.onResponse({
          network: config.networkName,
          method: type,
          path,
          statusCode: result.ok ? 200 : result.error.code,
          duration: Date.now() - startTimestamp,
        });
        return result;
      })
      .merge(router),
    createContext: () => context,
  };

  const stopPrometheusPush = await startPrometheusPush(
    backendRegistry,
    `explorer-backend-${config.networkName}`
  );

  const app = createApp(trpcOptions, backendRegistry);

  const server = app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });

  let shutdownHandlers: (() => void)[] = [];

  shutdownHandlers.push(connectWebsocketServer(server, trpcOptions));
  if (!config.offline) {
    await setupTelemetryDb();
    shutdownHandlers.push(runTasks(context));
    shutdownHandlers.push(stopPrometheusPush);
  }

  const gracefulShutdown = (signal: NodeJS.Signals) => {
    console.log(`Got ${signal} signal, shutting down`);
    shutdownHandlers.forEach((handler) => handler());
    server.close((err) => {
      if (err) {
        console.error("Error on server close", err);
      }
      console.log(`Shut down ${err ? "with error" : "gracefully"}`);
      process.exit(err ? 1 : 0);
    });
  };
  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);

  console.log("Explorer backend started");
}

void main(router);
