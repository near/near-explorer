const express = require("express");
const next = require("next");
const {
  stHttpLoggerMiddleware,
  stHttpLoggerReqMiddleware,
  stLogger,
} = require("./logger");
const uuid = require("uuid");
const GcStats = require("@sematext/gc-stats");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const expressApp = express();
  expressApp.use((req, _res, next) => {
    req.id = uuid.v4();
    next();
  });
  expressApp.use(stHttpLoggerReqMiddleware);
  expressApp.use(stHttpLoggerMiddleware);
  expressApp.all("*", (req, res) => handle(req, res));
  expressApp.listen(port, (err) => {
    if (err) {
      throw err;
    }
    stLogger.info(`Server started on http://explorer:${port}`);
  });
});

const gcStats = GcStats();
gcStats.on("data", (data) => {
  stLogger.info("GC_DATA", data);
});
gcStats.on("stats", (data) => {
  stLogger.info("GC_STATS", data);
});
