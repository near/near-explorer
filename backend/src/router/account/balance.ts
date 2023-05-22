import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getAccountRpcData } from "@/backend/router/account/by-id";
import { t } from "@/backend/router/trpc";
import { validators } from "@/backend/router/validators";

export const procedure = t.procedure
  .input(z.strictObject({ id: validators.accountId }))
  .query(async ({ input: { id } }) => {
    const rpcData = await getAccountRpcData(id);
    if (!rpcData) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Account ${id} does not exist on RPC`,
      });
    }
    return rpcData.amount.toString();
  });
