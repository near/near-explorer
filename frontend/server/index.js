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
    ].some((prefix) => req.path.startsWith(prefix))
  ) {
    return true;
  }
  if (req.path === "/") {
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
  },
  {
    id: "cohort-5",
    url: "https://near-explorer-experimental-frontend-with-9vaf.onrender.com",
    matches: (req) => req.path.startsWith("/nodes"),
  },
];

const COHORT_COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;

const COHORT_MIDDLEWARES = COHORTS.map((cohort) =>
  createProxyMiddleware({
    target: cohort.url,
    changeOrigin: true,
    onProxyRes: (proxyRes, req) => {
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
  expressApp.use(stHttpLoggerReqMiddleware);
  expressApp.use(stHttpLoggerMiddleware);

  expressApp.use((req, res, next) => {
    let cohortIndex = -1;
    if (isPage(req)) {
      cohortIndex = COHORTS.findIndex((cohort) => cohort.matches(req));
      if (cohortIndex === -1) {
        res.clearCookie("cohort-id");
      } else {
        req.setCohortId = COHORTS[cohortIndex].id;
      }
    } else {
      const cohortId = req.cookies["cohort-id"];
      if (cohortId) {
        cohortIndex = COHORTS.findIndex((cohort) => cohort.id === cohortId);
      }
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
});
