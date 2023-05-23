import { t } from "@/backend/router/trpc";

import { procedure as activity } from "./activity";
import { procedure as nonStakedBalance } from "./balance";
import { procedures as byIdProcedures } from "./by-id";
import { procedures as fungibleTokensProcedures } from "./fungible-tokens";
import { procedure as listByTimestamp } from "./list";
import { procedures as nonFungibleTokensProcedures } from "./non-fungible-tokens";
import { procedure as transactionsCount } from "./transactions-count";

export const router = t.router({
  byId: byIdProcedures.byId,
  byIdOld: byIdProcedures.byIdOld,
  listByTimestamp,
  transactionsCount,
  fungibleTokens: fungibleTokensProcedures.fungibleTokens,
  fungibleTokenHistory: fungibleTokensProcedures.fungibleTokenHistory,
  activity,
  nonFungibleTokenContracts:
    nonFungibleTokensProcedures.nonFungibleTokenContracts,
  nonFungibleTokenHistory: nonFungibleTokensProcedures.nonFungibleTokenHistory,
  nonFungibleTokens: nonFungibleTokensProcedures.nonFungibleTokens,
  nonFungibleTokensCount: nonFungibleTokensProcedures.nonFungibleTokensCount,
  nonStakedBalance,
});
