import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "../context";
import * as accounts from "../providers/accounts";
import * as fungibleTokens from "../providers/fungible-tokens";
import * as nearApi from "../utils/near";
import { validators } from "./validators";

export const router = trpc
  .router<Context>()
  .query("is-account-indexed", {
    input: z.tuple([validators.accountId]),
    resolve: ({ input: [accountId] }) => {
      return accounts.isAccountIndexed(accountId);
    },
  })
  .query("account-info", {
    input: z.tuple([validators.accountId]),
    resolve: async ({ input: [accountId] }) => {
      const [accountInfo, accountDetails] = await Promise.all([
        accounts.getAccountInfo(accountId),
        accounts.getAccountDetails(accountId),
      ]);
      if (!accountInfo) {
        return null;
      }
      return {
        ...accountInfo,
        details: accountDetails,
      };
    },
  })
  .query("account", {
    input: z.strictObject({
      accountId: validators.accountId,
    }),
    resolve: async ({ input: { accountId } }) => {
      const isAccountIndexed = await accounts.isAccountIndexed(accountId);
      if (!isAccountIndexed) {
        return null;
      }
      const [accountInfo, accountDetails, nearCoreAccount, transactionsCount] =
        await Promise.all([
          accounts.getAccountInfo(accountId),
          accounts.getAccountDetails(accountId),
          nearApi.sendJsonRpcQuery("view_account", {
            finality: "final",
            account_id: accountId,
          }),
          accounts.getAccountTransactionsCount(accountId),
        ]);
      if (!accountInfo || !accountDetails) {
        return null;
      }
      return {
        id: accountId,
        isContract:
          nearCoreAccount.code_hash !== "11111111111111111111111111111111",
        created: accountInfo.created,
        storageUsed: accountDetails.storageUsage,
        nonStakedBalance: accountDetails.nonStakedBalance,
        stakedBalance: accountDetails.stakedBalance,
        transactionsQuantity:
          transactionsCount.inTransactionsCount +
          transactionsCount.outTransactionsCount,
      };
    },
  })
  .query("accounts-list", {
    input: z.strictObject({
      limit: validators.limit,
      cursor: validators.accountPagination.optional(),
    }),
    resolve: ({ input: { limit, cursor } }) => {
      return accounts.getAccountsList(limit, cursor);
    },
  })
  .query("account-transactions-count", {
    input: z.tuple([validators.accountId]),
    resolve: ({ input: [accountId] }) => {
      return accounts.getAccountTransactionsCount(accountId);
    },
  })
  .query("account-fungible-tokens", {
    input: z.strictObject({
      accountId: validators.accountId,
    }),
    resolve: async ({ input: { accountId } }) => {
      return fungibleTokens.getFungibleTokens(accountId);
    },
  })
  .query("account-fungible-token-history", {
    input: z.strictObject({
      accountId: validators.accountId,
      tokenAuthorAccountId: z.string(),
    }),
    resolve: async ({ input: { accountId, tokenAuthorAccountId } }) => {
      return fungibleTokens.getFungibleTokenHistory(
        accountId,
        tokenAuthorAccountId
      );
    },
  });
