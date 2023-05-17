import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { RequestContext } from "@explorer/backend/context";
import { getAccountRpcData } from "@explorer/backend/router/account/by-id";
import { validators } from "@explorer/backend/router/validators";

export const router = trpc.router<RequestContext>().query("nonStakedBalance", {
  input: z.strictObject({ id: validators.accountId }),
  resolve: async ({ input: { id } }) => {
    const rpcData = await getAccountRpcData(id);
    if (!rpcData) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Account ${id} does not exist on RPC`,
      });
    }
    return rpcData.amount.toString();
  },
});
