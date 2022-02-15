const express = require("express");
const next = require("next");
const {
  stHttpLoggerMiddleware,
  stHttpLoggerReqMiddleware,
  stLogger,
} = require("./logger");
const uuid = require("uuid");
const cookieParser = require("cookie-parser");

const { createProxyMiddleware } = require("http-proxy-middleware");

const isPage = (req) => {
  let path = req.path;
  if (path.startsWith("/_next/static")) {
    return false;
  }
  // /_next/data/qBIGsJpVfKbBmgV88TRWE/accounts/near.testnet.json
  // ->
  // /accounts/near.testnet.json
  if (path.startsWith("/_next/data/")) {
    path = ["", ...path.split("/").slice(4)].join("/");
  }
  if (
    [
      "/blocks",
      "/accounts",
      "/api",
      "/contracts",
      "/nodes",
      "/partner",
      "/stats",
      "/transactions",
    ].some((prefix) => path.startsWith(prefix))
  ) {
    return true;
  }
  if (path === "/") {
    return true;
  }
  return false;
};

const COHORTS = [
  {
    id: "cohort-1",
    url: "https://near-explorer-experimental-frontend-with-kq9o.onrender.com",
    matches: (req) => req.path.startsWith("/blocks"),
  },
  {
    id: "cohort-2",
    url: "https://near-explorer-experimental-frontend-with-rial.onrender.com",
    matches: (req) => req.path.startsWith("/transactions"),
  },
  {
    id: "cohort-3",
    url: "https://near-explorer-experimental-frontend-with-y2qc.onrender.com",
    matches: (req) => req.path.startsWith("/accounts"),
  },
  {
    id: "cohort-4",
    url: "https://near-explorer-experimental-frontend-with-5h9x.onrender.com",
    matches: (req) => req.path.startsWith("/api"),
    disabled: true,
  },
  {
    id: "cohort-5",
    url: "https://near-explorer-experimental-frontend-with-9vaf.onrender.com1",
    matches: (req) => req.path.startsWith("/nodes"),
  },
];

const COHORT_COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;

let unansweredCalls = {};

const COHORT_MIDDLEWARES = COHORTS.map((cohort) =>
  createProxyMiddleware({
    target: cohort.url,
    changeOrigin: true,
    onProxyReq: (_proxyReq, req) => {
      req.id = uuid.v4();
      const callData = {
        path: req.path,
        cohortId: req.setCohortId,
        timestamp: Date.now(),
      };
      unansweredCalls[req.id] = callData;
    },
    onProxyRes: (proxyRes, req) => {
      delete unansweredCalls[req.id];
      if (!req.setCohortId) {
        return;
      }
      const headers = proxyRes.headers;
      const cookie = `cohort-id=${req.setCohortId}; MaxAge=${COHORT_COOKIE_MAX_AGE}; Path=/`;
      if (Array.isArray(headers["set-cookie"])) {
        headers["set-cookie"].push(cookie);
      } else if (typeof headers["set-cookie"] === "string") {
        headers["set-cookie"] = [headers["set-cookie"], cookie];
      } else {
        headers["set-cookie"] = [cookie];
      }
    },
  })
);

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const expressApp = express();
  expressApp.use(cookieParser());
  expressApp.use((req, _res, next) => {
    req.id = uuid.v4();
    next();
  });
  if (!dev) {
    expressApp.use(stHttpLoggerReqMiddleware);
    expressApp.use(stHttpLoggerMiddleware);
  }

  expressApp.use((req, res, next) => {
    let cohortIndex = -1;
    if (isPage(req)) {
      cohortIndex = COHORTS.findIndex(
        (cohort) => !cohort.disabled && cohort.matches(req)
      );
      if (cohortIndex === -1) {
        res.clearCookie("cohort-id");
      } else {
        req.setCohortId = COHORTS[cohortIndex].id;
      }
    } else {
      const cohortId = req.cookies["cohort-id"];
      if (cohortId) {
        cohortIndex = COHORTS.findIndex(
          (cohort) => !cohort.disabled && cohort.id === cohortId
        );
      }
    }
    if (dev) {
      // console.log(`Cohort ${cohortIndex} for ${req.path}`);
    }
    if (cohortIndex !== -1) {
      COHORT_MIDDLEWARES[cohortIndex](req, res, next);
    } else {
      next();
    }
  });

  expressApp.all("*", (req, res) => handle(req, res));
  expressApp.listen(port, (err) => {
    if (err) {
      throw err;
    }
    stLogger.info(`Server started on http://explorer:${port}`);
  });

  const WAIT_TIME = 30 * 1000;
  const INTERVAL_TIME = 15 * 1000;
  setInterval(() => {
    const now = Date.now();
    const unansweredEntries = Object.entries(unansweredCalls);
    const longCallEntries = unansweredEntries.filter(
      ([_, value]) => now - value.timestamp > WAIT_TIME
    );
    console.log(
      `Total entries: ${unansweredEntries.length}, long-called: ${longCallEntries.length}`
    );
    if (longCallEntries.length === 0) {
      return;
    }
    console.log(
      `Long call entries:\n${longCallEntries
        .map(
          ([_, value]) =>
            `- call in cohort ${value.cohortId} on path "${
              value.path
            }" at ${new Date(value.timestamp).toISOString()}`
        )
        .join("\n")}`
    );
    longCallEntries.forEach(([key]) => delete unansweredCalls[key]);
    console.log(
      `Entries after clean-up: ${Object.keys(unansweredCalls).length}`
    );
  }, INTERVAL_TIME);
});
