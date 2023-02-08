import * as trpc from "@trpc/server";
import type { HTTPBaseHandlerOptions } from "@trpc/server/dist/declarations/src/http/internals/types";
import type http from "http";
import { ZodError } from "zod";
import { generateErrorMessage, ErrorMessageOptions } from "zod-error";

import type { AppRouter } from "@explorer/backend/router";

const errorOptions: ErrorMessageOptions = {
  delimiter: {
    error: "\n",
  },
  message: {
    enabled: true,
    label: "",
  },
  path: {
    enabled: true,
    type: "objectNotation",
    label: "",
  },
  transform: ({ pathComponent, messageComponent }) =>
    `Error: ${messageComponent} at path "${pathComponent}"`,
};

const logError = (
  code: string,
  type: string,
  path: string | undefined,
  message: string,
  input: unknown,
  stack?: string
) => {
  const elements = [
    [`[${code}]`, `${type} "${path}": ${message}`],
    ["[INPUT]", (JSON.stringify(input) || "undefined").slice(0, 300)],
    ["[STACK]", stack],
  ];
  // eslint-disable-next-line no-console
  console.error(
    elements
      .filter(([, value]) => Boolean(value))
      .map((values) => values.join(": "))
      .join("\n")
  );
};

const ZOD_ERROR_CAUSE = "Zod validation error";

export const onError: HTTPBaseHandlerOptions<
  AppRouter,
  http.IncomingMessage
>["onError"] = ({ error, ctx, type, path, input }) => {
  if (!ctx) {
    return;
  }
  if (error.code === "BAD_REQUEST" && error.cause instanceof ZodError) {
    const message = generateErrorMessage(error.cause.issues, errorOptions);
    logError(error.code, type, path, message, input);
    throw new trpc.TRPCError({
      code: "BAD_REQUEST",
      message,
      cause: ZOD_ERROR_CAUSE,
    });
  } else if (error.cause !== ZOD_ERROR_CAUSE) {
    logError(error.code, type, path, error.message, input, error.stack);
  }
};
