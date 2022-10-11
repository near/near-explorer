import express from "express";
import next from "next";
import prometheus from "prom-client";
import {
  createLogging,
  getMetricsHandler,
} from "../../common/src/utils/logging";
import { getNearNetworkName } from "../src/libraries/config";

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

const main = async () => {
  console.log("Starting Explorer frontend...");
  const app = next({ dev });
  const handle = app.getRequestHandler();

  const frontendRegistry = new prometheus.Registry();

  await app.prepare();
  const logging = await createLogging(frontendRegistry);
  const expressApp = express();

  expressApp.get("/metrics", getMetricsHandler(frontendRegistry));

  expressApp.use((req, res, next) => {
    res.locals.startTimestamp = Date.now();
    res.locals.networkName = getNearNetworkName(req.query, req.headers.host);
    logging.onRequest({
      network: res.locals.networkName,
      method: req.method,
      path: req.path,
    });
    next();
  });
  expressApp.all("*", async (req, res, next) => {
    await handle(req, res);
    next();
  });
  expressApp.use((req, res, next) => {
    logging.onResponse({
      network: res.locals.networkName,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: Date.now() - res.locals.startTimestamp,
    });
    next();
  });
  await new Promise((resolve) => expressApp.listen(port, () => resolve(true)));

  const gracefulShutdown = (signal: NodeJS.Signals) => {
    console.log(`Got ${signal} signal, shutting down`);
    app.close().catch((err) => {
      if (err) {
        console.error("Error on server close", err);
      }
      console.log(`Shut down ${err ? "with error" : "gracefully"}`);
      process.exit(err ? 1 : 0);
    });
  };
  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);

  console.log("Explorer frontend started");
};

void main();
