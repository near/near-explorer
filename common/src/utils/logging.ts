import { RequestHandler } from "express-serve-static-core";
import prometheus, { Registry } from "prom-client";

import { getGitData } from "./git";

type OnRequestMessage = {
  network: string;
  method: string;
  path: string;
};

type OnResponseMessage = OnRequestMessage & {
  statusCode: string | number;
  duration: number;
};

export const createLogging = async (registry: Registry) => {
  const gitData = await getGitData();
  prometheus.collectDefaultMetrics({
    register: registry,
    labels: gitData,
  });
  const httpRequestCount = new prometheus.Counter({
    registers: [registry],
    name: "nodejs_http_req_total_count",
    help: "total request number",
    labelNames: ["network", "method", "route"],
  });
  const httpResponseCount = new prometheus.Counter({
    registers: [registry],
    name: "nodejs_http_res_total_count",
    help: "total response number",
    labelNames: ["network", "method", "route", "code"],
  });
  const httpRequestDurationMicroseconds = new prometheus.Histogram({
    registers: [registry],
    name: "http_request_duration_ms",
    help: "Duration of HTTP requests in ms",
    labelNames: ["network", "method", "route", "code"],
    buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500], // buckets for response time from 0.1ms to 500ms
  });
  return {
    onRequest: ({ network, method, path }: OnRequestMessage) => {
      httpRequestCount.labels(network, method, path).inc();
    },
    onResponse: ({
      network,
      method,
      path,
      statusCode,
      duration,
    }: OnResponseMessage) => {
      httpRequestDurationMicroseconds
        .labels(network, method, path, statusCode.toString())
        .observe(duration);
      httpResponseCount
        .labels(network, method, path, statusCode.toString())
        .inc();
    },
  };
};

export const getMetricsHandler =
  (registry: Registry): RequestHandler =>
  async (_req, res, next) => {
    try {
      res.setHeader("content-type", registry.contentType);
      const metrics = await registry.metrics();
      res.send(metrics);
    } catch (error) {
      return next(error);
    }
  };
