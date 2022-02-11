const express = require("express");
const next = require("next");
const {
  stHttpLoggerMiddleware,
  stHttpLoggerReqMiddleware,
  stLogger,
} = require("./logger");
const uuid = require("uuid");
const GcStats = require("@sematext/gc-stats");

const v8 = require("v8");
const fs = require("fs");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

const mkDirIfNotExist = (dirname) => {
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
};

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

const KB = 1024;
const MB = 1024 * KB;
const inMb = (size) => (size / MB).toFixed(2) + "MB";

let snapshotWritten = false;
const snapshotHeapSize = parseInt(process.env.SNAPSHOT_HEAP_SIZE, 10) || 0;
const gcStats = GcStats();
gcStats.on("stats", (data) => {
  stLogger.info("GC_STATS", data);
  if (!process.env.STOP_HEAPDUMP_LOG) {
    console.log(
      `Heapdump size: ${inMb(data.after.usedHeapSize)} / ${inMb(
        data.after.totalHeapSize
      )}`
    );
  }
  if (snapshotHeapSize && data.after.usedHeapSize > snapshotHeapSize * MB) {
    const now = Date.now();
    if (snapshotWritten) {
      console.log(
        `Heapdump is now ${inMb(
          data.after.usedHeapSize
        )}, but snapshot was already wrote once`
      );
      return;
    }
    console.log(
      `Ok heapdump is now ${inMb(
        data.after.usedHeapSize
      )}, writing heap snapshot`
    );
    const headDir = "/tmp/heaps";
    mkDirIfNotExist(headDir);
    const snapshotName = `heapdump-${new Date()
      .toISOString()
      .replace(/:/g, "-")}.heapdump`;
    v8.writeHeapSnapshot(`${headDir}/${snapshotName}`);
    snapshotWritten = true;
    const delta = Date.now() - now;
    console.log(`Heap snapshot wrote as ${snapshotName} in ${delta / 1000}s`);
  }
});
