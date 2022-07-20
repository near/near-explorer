import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "../../context";
import { indexerDatabase } from "../../database/databases";
import { div } from "../../database/utils";
import * as nearApi from "../../utils/near";
import { validators } from "../validators";
import { notNullGuard } from "../../common";

// https://nomicon.io/Standards/Tokens/FungibleToken/Metadata
type FungibleTokenMetadata = {
  spec: string;
  name: string;
  symbol: string;
  icon: string | null;
  reference: string | null;
  reference_hash: string | null;
  decimals: number;
};

const base64ImageRegex = /^data:image/;
const validateBase64Image = (base64Image: string | null): string | null => {
  if (!base64Image) {
    return null;
  }
  return base64ImageRegex.test(base64Image) ? base64Image : null;
};

export const router = trpc
  .router<Context>()
  .query("fungibleTokens", {
    input: z.strictObject({
      accountId: validators.accountId,
    }),
    resolve: async ({ input: { accountId } }) => {
      const selection = await indexerDatabase
        .selectFrom("assets__fungible_token_events")
        .select("emitted_by_contract_account_id as contractId")
        .distinctOn("emitted_by_contract_account_id")
        .where("token_new_owner_account_id", "=", accountId)
        .orWhere("token_old_owner_account_id", "=", accountId)
        .orderBy("emitted_by_contract_account_id", "desc")
        .execute();
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
      return tokens.filter(notNullGuard);
    },
  })
  .query("fungibleTokenHistory", {
    input: z.strictObject({
      accountId: validators.accountId,
      tokenAuthorAccountId: z.string(),
    }),
    resolve: async ({ input: { accountId, tokenAuthorAccountId } }) => {
      const elements = await indexerDatabase
        .selectFrom("assets__fungible_token_events")
        .innerJoin("receipts", (qb) =>
          qb.onRef("emitted_for_receipt_id", "=", "receipts.receipt_id")
        )
        .innerJoin("blocks", (qb) =>
          qb.onRef("blocks.block_hash", "=", "receipts.included_in_block_hash")
        )
        .select([
          "amount",
          "token_old_owner_account_id as prevAccountId",
          "token_new_owner_account_id as nextAccountId",
          "emitted_for_receipt_id as receiptId",
          (eb) =>
            div(eb, "emitted_at_block_timestamp", 1000 * 1000, "timestamp"),
          "originated_from_transaction_hash as transactionHash",
          "block_height as blockHeight",
        ])
        .where("emitted_by_contract_account_id", "=", tokenAuthorAccountId)
        .where((wi) =>
          wi
            .where("token_new_owner_account_id", "=", accountId)
            .orWhere("token_old_owner_account_id", "=", accountId)
        )
        .orderBy("emitted_at_block_timestamp", "desc")
        .orderBy("emitted_in_shard_id", "desc")
        .orderBy("emitted_index_of_event_entry_in_shard", "desc")
        // Pagination to be introduced soon..
        .limit(200)
        .execute();
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
          timestamp: parseInt(element.timestamp),
        })),
      };
    },
  });
