import * as trpc from "@trpc/server";
import { sql } from "kysely";
import { z } from "zod";

import { Context } from "@explorer/backend/context";
import { indexerDatabase } from "@explorer/backend/database/databases";
import { validators } from "@explorer/backend/router/validators";
import * as nearApi from "@explorer/backend/utils/near";

// https://nomicon.io/Standards/Tokens/FungibleToken/Metadata
export type FungibleTokenMetadata = {
  spec: string;
  name: string;
  symbol: string;
  icon: string | null;
  reference: string | null;
  reference_hash: string | null;
  decimals: number;
};

export const router = trpc
  .router<Context>()
  .query("amount", {
    resolve: async () => {
      const selection = await indexerDatabase
        .selectFrom("assets__fungible_token_events")
        // TODO: Research if we can get rid of distinct without performance degradation
        .select(
          sql<string>`count(distinct emitted_by_contract_account_id)`.as(
            "amount"
          )
        )
        .executeTakeFirstOrThrow();
      return parseInt(selection.amount, 10);
    },
  })
  .query("list", {
    input: z.strictObject({
      limit: validators.limit,
      cursor: z.number().optional(),
    }),
    resolve: async ({ input: { limit, cursor = 0 } }) => {
      const tokens = await indexerDatabase
        .selectFrom("assets__fungible_token_events")
        // TODO: Research if we can get rid of distinct without performance degradation
        .select("emitted_by_contract_account_id as id")
        .distinctOn("emitted_by_contract_account_id")
        .orderBy("id", "desc")
        .limit(limit)
        .offset(cursor)
        .execute();
      const fungibleTokenContracts = tokens.map((token) => token.id);
      return Promise.all(
        fungibleTokenContracts.map(async (contract) => {
          const totalSupply = await nearApi.callViewMethod<string>(
            contract,
            "ft_total_supply",
            {}
          );
          const fungibleTokenMetadata =
            await nearApi.callViewMethod<FungibleTokenMetadata>(
              contract,
              "ft_metadata",
              {}
            );
          return {
            authorAccountId: contract,
            name: fungibleTokenMetadata.name,
            balance: totalSupply,
            symbol: fungibleTokenMetadata.symbol,
            decimals: fungibleTokenMetadata.decimals,
            icon: fungibleTokenMetadata.icon,
          };
        })
      );
    },
  });
