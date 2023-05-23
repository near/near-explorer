import { z } from "zod";

import { t } from "@/backend/router/trpc";
import { validators } from "@/backend/router/validators";
import * as nearApi from "@/backend/utils/near";

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

export const router = t.router({
  amount: t.procedure.query(async () => {
    // TODO: add data from Enhanced API
    const selection = { amount: "0" };
    return parseInt(selection.amount, 10);
  }),
  list: t.procedure
    .input(
      z.strictObject({
        limit: validators.limit,
        cursor: z.number().optional(),
      })
    )
    .query(async () => {
      // TODO: add data from Enhanced API
      const tokens: { id: string }[] = [];
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
    }),
});
