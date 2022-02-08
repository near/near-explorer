require("dotenv").config();

const sematextAgentExpress = require("sematext-agent-express");
const winston = require("winston");
const morgan = require("morgan");

morgan.token("id", (req) => req.id);

const loggerOptions = {
  transports: [new winston.transports.Console({ level: "silly" })],
};

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

module.exports.stHttpLoggerMiddleware = stHttpLoggerMiddleware;
module.exports.stHttpLoggerReqMiddleware = stHttpLoggerReqMiddleware;
module.exports.stLogger = stLogger;
