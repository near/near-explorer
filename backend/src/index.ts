import { EventEmitter } from "events";
import { setupTelemetryDb } from "./utils/telemetry";
import { runTasks } from "./cron";
import { AppRouter, router } from "./router";
import { connectWebsocketServer, createApp } from "./server";
import { config } from "./config";
import { initGlobalState } from "./global-state";
import { Context } from "./context";

async function main(router: AppRouter): Promise<void> {
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
  const trpcOptions = {
    router,
    createContext: () => context,
  };

  const app = createApp(trpcOptions);

  const server = app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });

  let shutdownHandlers: (() => void)[] = [];

  shutdownHandlers.push(connectWebsocketServer(server, trpcOptions));
  if (!config.offline) {
    await setupTelemetryDb();
    shutdownHandlers.push(runTasks(context));
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
