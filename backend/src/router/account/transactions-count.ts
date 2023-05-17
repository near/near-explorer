import * as trpc from "@trpc/server";
import { z } from "zod";

import { RequestContext } from "@explorer/backend/context";
import { getAccountTransactionsCount } from "@explorer/backend/router/account/utils";
import { validators } from "@explorer/backend/router/validators";

export const router = trpc.router<RequestContext>().query("transactionsCount", {
  input: z.strictObject({ id: validators.accountId }),
  resolve: ({ input: { id } }) => getAccountTransactionsCount(id),
});
