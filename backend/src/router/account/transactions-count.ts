import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "@explorer/backend/context";
import { validators } from "@explorer/backend/router/validators";
import { getAccountTransactionsCount } from "@explorer/backend/router/account/utils";

export const router = trpc.router<Context>().query("transactionsCount", {
  input: z.strictObject({ id: validators.accountId }),
  resolve: ({ input: { id } }) => {
    return getAccountTransactionsCount(id);
  },
});
