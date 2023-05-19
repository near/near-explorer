import * as trpc from "@trpc/server";
import { z } from "zod";

import { RequestContext } from "@/backend/context";
import { enhancedApi } from "@/backend/providers/enhanced-api";
import { validators } from "@/backend/router/validators";
import { nanosecondsToMilliseconds } from "@/backend/utils/bigint";

const base64ImageRegex = /^data:image/;
export const validateBase64Image = (
  base64Image: string | null
): string | null => {
  if (!base64Image) {
    return null;
  }
  return base64ImageRegex.test(base64Image) ? base64Image : null;
};

export const router = trpc
  .router<RequestContext>()
  .query("fungibleTokens", {
    input: z.strictObject({
      accountId: validators.accountId,
    }),
    resolve: async ({ input: { accountId } }) => {
      const { balances } = await enhancedApi.FT.balances(accountId);
      return balances.map((ft) => ({
        symbol: ft.metadata.symbol,
        decimals: ft.metadata.decimals,
        name: ft.metadata.name,
        authorAccountId: ft.contract_account_id,
        icon: validateBase64Image(ft.metadata.icon),
        balance: ft.amount,
      }));
    },
  })
  .query("fungibleTokenHistory", {
    input: z.strictObject({
      accountId: validators.accountId,
      tokenAuthorAccountId: validators.accountId,
    }),
    resolve: async ({ input: { accountId, tokenAuthorAccountId } }) => {
      const [{ balance }, { history }] = await Promise.all([
        enhancedApi.FT.balanceByContract(accountId, tokenAuthorAccountId),
        enhancedApi.FT.historyByContract(accountId, tokenAuthorAccountId),
      ]);
      return {
        baseAmount: balance.amount,
        elements: history.map((element) => ({
          counterparty:
            element.old_account_id === accountId
              ? element.new_account_id
              : element.old_account_id,
          direction: element.old_account_id === accountId ? "out" : "in",
          // TODO: get amount, hash and receipt id
          amount: "1",
          transactionHash: "unknown",
          receiptId: "unknown",
          timestamp: nanosecondsToMilliseconds(
            BigInt(element.block_timestamp_nanos)
          ),
        })),
      };
    },
  });
