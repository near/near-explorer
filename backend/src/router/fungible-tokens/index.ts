import * as trpc from "@trpc/server";
import { z } from "zod";

import { RequestContext } from "@explorer/backend/context";
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
  .router<RequestContext>()
  .query("amount", {
    resolve: async () => {
      // TODO: add data from Enhanced API
      const selection = { amount: "0" };
      return parseInt(selection.amount, 10);
    },
  })
  .query("list", {
    input: z.strictObject({
      limit: validators.limit,
      cursor: z.number().optional(),
    }),
    resolve: async () => {
      // TODO: add data from Enhanced API
      const tokens: any[] = [];
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
