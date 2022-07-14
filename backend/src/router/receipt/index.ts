import * as trpc from "@trpc/server";
import { Context } from "../../context";
import { router as listRouter } from "./list";

export const router = trpc.router<Context>().merge(listRouter);
