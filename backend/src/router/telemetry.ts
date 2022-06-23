import { z } from "zod";
import * as trpc from "@trpc/server";

import { Context } from "../context";
import { validators } from "./validators";

import * as telemetry from "../providers/telemetry";

export const router = trpc.router<Context>().mutation("node-telemetry", {
  input: z.tuple([validators.telemetryRequest]),
  resolve: ({ input: [nodeInfo] }) => {
    return telemetry.sendTelemetry(nodeInfo);
  },
});
