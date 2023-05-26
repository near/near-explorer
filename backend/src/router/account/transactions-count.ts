import { z } from "zod";

import { getAccountTransactionsCount } from "@/backend/router/account/utils";
import { commonProcedure } from "@/backend/router/trpc";
import { validators } from "@/backend/router/validators";

export const procedure = commonProcedure
  .input(z.strictObject({ id: validators.accountId }))
  .query(({ input: { id } }) => getAccountTransactionsCount(id));
