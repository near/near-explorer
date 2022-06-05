import dotenv from "dotenv";
dotenv.config();

import sematextAgentExpress from "sematext-agent-express";
import winston from "winston";
import morgan from "morgan";

morgan.token("id", (req) => req.id);

const loggerOptions =
  process.env.NODE_ENV !== "production"
    ? {
        transports: [new winston.transports.Console({ level: "silly" })],
      }
    : undefined;

const httpLoggerOptions = {
  morganFormat: {
    id: ":id",
    bodySize: ":req[content-length]",
  },
  morganWriter: (message) => ({ id: message.id, bodySize: message.bodySize }),
};

const { stMonitor, stHttpLoggerMiddleware, stLogger } = sematextAgentExpress({
  httpLogger: httpLoggerOptions,
  logger: loggerOptions,
});
const {
  stHttpLoggerMiddleware: stHttpLoggerReqMiddleware,
} = sematextAgentExpress({
  httpLogger: {
    ...httpLoggerOptions,
    morganOptions: {
      immediate: true,
    },
    loggerMessage: "HTTP_REQ_LOG",
  },
  logger: loggerOptions,
});

stMonitor.start();

export { stHttpLoggerMiddleware, stHttpLoggerReqMiddleware, stLogger };
