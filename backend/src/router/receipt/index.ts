import { t } from "@/backend/router/trpc";

import { procedure as getTransactionHash } from "./get-transaction-hash";
import { procedures as listProcedures } from "./list";

export const router = t.router({
  listExecutedByBlockHash: listProcedures.listExecutedByBlockHash,
  listIncludedByBlockHash: listProcedures.listIncludedByBlockHash,
  getTransactionHash,
});
