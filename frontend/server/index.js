const express = require("express");
const next = require("next");
const {
  stHttpLoggerMiddleware,
  stHttpLoggerReqMiddleware,
  stLogger,
} = require("./logger");
const uuid = require("uuid");
const GcStats = require("@sematext/gc-stats");

const path = require("path");
const fs = require("fs");
const heampDumpDir = "/tmp/my_heapdump";
if (!fs.existsSync(heampDumpDir)) {
  fs.mkdirSync(heampDumpDir, { recursive: true });
}
require("node-oom-heapdump")({
  addTimestamp: true,
  port: 9999,
  path: path.resolve(heampDumpDir),
});

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
    const dir = "/tmp/testdir";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      `${dir}/${new Date().getMilliseconds()}.test`,
      `Current time: ${new Date().toISOString()}`
    );
  });
});

const gcStats = GcStats();
gcStats.on("data", (data) => {
  stLogger.info("GC_DATA", data);
});
gcStats.on("stats", (data) => {
  stLogger.info("GC_STATS", data);
});
