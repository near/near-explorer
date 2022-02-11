const express = require("express");
const next = require("next");
const {
  stHttpLoggerMiddleware,
  stHttpLoggerReqMiddleware,
  stLogger,
} = require("./logger");
const uuid = require("uuid");

const path = require("path");
const fs = require("fs");
require("node-oom-heapdump")({
  addTimestamp: true,
  port: 9999,
  path: path.resolve("/tmp/my_heapdump"),
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
    console.log("Started - log");
    console.warn("Started - warn");
    console.error("Started - error");
    fs.mkdirSync("/tmp/testdir");
    fs.writeFileSync("/tmp/testdir/file.test", "Test data");
  });
});
