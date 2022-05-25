import { initPubSub } from "./pubsub";
import { setup as setupTelemetryDb } from "./providers/telemetry";
import { runTasks } from "./cron";
import { GlobalState, initGlobalState } from "./global-state";
import { Context } from "./context";
import { ProcedureHandlers, procedureHandlers } from "./router/procedures";
import autobahn from "autobahn";

async function main(handlers: ProcedureHandlers): Promise<void> {
  console.log("Starting Explorer backend & pub-sub controller...");

  const state: GlobalState = initGlobalState();
  const controller = initPubSub(
    state,
    Object.entries(handlers).map(([key, handler]) => [
      key,
      ((args) => handler(args as any, state)) as autobahn.RegisterEndpoint,
    ])
  );
  const context: Context = {
    state,
    publishWamp: controller.publish,
  };

  await setupTelemetryDb();

  const stopTasks = runTasks(context);

  const gracefulShutdown = (signal: NodeJS.Signals) => {
    console.log(`Got ${signal} signal, shutting down`);
    stopTasks();
    console.log(`Shut down gracefully`);
    process.exit(0);
  };
  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);

  console.log("Explorer backend started");
}

void main(procedureHandlers);
