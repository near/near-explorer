import { t } from "@/backend/router/trpc";

import { procedures as getProcedures } from "./get";
import { procedures as listProcedures } from "./list";

export const router = t.router({
  byHashOld: getProcedures.byHashOld,
  byHash: getProcedures.byHash,
  accountBalanceChange: getProcedures.accountBalanceChange,
  listByTimestamp: listProcedures.byTimestamp,
  listByAccountId: listProcedures.byAccountId,
  listByBlockHash: listProcedures.byBlockHash,
});
