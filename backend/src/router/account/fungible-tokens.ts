import { z } from "zod";

import { FungibleTokenMetadata } from "@/backend/router/fungible-tokens";
import { commonProcedure } from "@/backend/router/trpc";
import { validators } from "@/backend/router/validators";
import * as nearApi from "@/backend/utils/near";
import { notNullishGuard } from "@/common/utils/utils";

const base64ImageRegex = /^data:image/;
export const validateBase64Image = (
  base64Image: string | null
): string | null => {
  if (!base64Image) {
    return null;
  }
  return base64ImageRegex.test(base64Image) ? base64Image : null;
};

export const procedures = {
  fungibleTokens: commonProcedure
    .input(
      z.strictObject({
        accountId: validators.accountId,
      })
    )
    .query(async ({ input: { accountId } }) => {
      // TODO: add data from Enhanced API
      const selection: { contractId: string }[] = [];
      const contractIds = selection.map((row) => row.contractId);
      const tokens = await Promise.all(
        contractIds.map(async (contractId) => {
          const balance = await nearApi.callViewMethod<string>(
            contractId,
            "ft_balance_of",
            { account_id: accountId }
          );
          if (balance === "0") {
            return null;
          }
          const fungibleTokenMetadata =
            await nearApi.callViewMethod<FungibleTokenMetadata>(
              contractId,
              "ft_metadata",
              {}
            );

          return {
            symbol: fungibleTokenMetadata.symbol,
            decimals: fungibleTokenMetadata.decimals,
            name: fungibleTokenMetadata.name,
            authorAccountId: contractId,
            icon: validateBase64Image(fungibleTokenMetadata.icon),
            balance,
          };
        })
      );
      return tokens.filter(notNullishGuard);
    }),
  fungibleTokenHistory: commonProcedure
    .input(
      z.strictObject({
        accountId: validators.accountId,
        tokenAuthorAccountId: validators.accountId,
      })
    )
    .query(async ({ input: { accountId, tokenAuthorAccountId } }) => {
      // TODO: add data from Enhanced API
      const elements: {
        amount: string;
        prevAccountId: string;
        nextAccountId: string;
        receiptId: string;
        timestamp: string;
        transactionHash: string;
        blockHeight: string;
      }[] = [];
      const baseAmount = await nearApi.callViewMethod<string>(
        tokenAuthorAccountId,
        "ft_balance_of",
        { account_id: accountId },
        { block_id: Number(elements[elements.length - 1].blockHeight) - 1 }
      );
      return {
        baseAmount,
        elements: elements.map((element) => ({
          counterparty:
            element.prevAccountId === accountId
              ? element.nextAccountId
              : element.prevAccountId,
          direction: element.prevAccountId === accountId ? "out" : "in",
          amount: element.amount,
          transactionHash: element.transactionHash,
          receiptId: element.receiptId,
          timestamp: parseInt(element.timestamp, 10),
        })),
      };
    }),
};
