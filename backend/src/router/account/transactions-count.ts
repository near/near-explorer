import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "../../context";
import { validators } from "../validators";
import { getAccountTransactionsCount } from "./utils";

export const router = trpc.router<Context>().query("transactionsCount", {
  input: z.strictObject({ id: validators.accountId }),
  resolve: ({ input: { id } }) => {
    return getAccountTransactionsCount(id);
  },
});
