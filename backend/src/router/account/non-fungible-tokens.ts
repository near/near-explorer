import * as trpc from "@trpc/server";
import { z } from "zod";

import { Context } from "../../context";
import { indexerDatabase } from "../../database/databases";
import { div } from "../../database/utils";
import * as nearApi from "../../utils/near";
import { validators } from "../validators";
import { notNullGuard } from "../../common";

type Token = {
  token_id: string;
  owner_id: string;
  metadata: TokenMetadata;
};

type NFTContractMetadata = {
  spec: string; // required, essentially a version like "nft-2.0.0", replacing "2.0.0" with the implemented version of NEP-177
  name: string; // required, ex. "Mochi Rising — Digital Edition" or "Metaverse 3"
  symbol: string; // required, ex. "MOCHI"
  icon: string | null; // Data URL
  base_uri: string | null; // Centralized gateway known to have reliable access to decentralized storage assets referenced by `reference` or `media` URLs
  reference: string | null; // URL to a JSON file with more info
  reference_hash: string | null; // Base64-encoded sha256 hash of JSON from reference field. Required if `reference` is included.
};

type TokenMetadata = {
  title: string | null; // ex. "Arch Nemesis: Mail Carrier" or "Parcel #5055"
  description: string | null; // free-form description
  media: string | null; // URL to associated media, preferably to decentralized, content-addressed storage
  media_hash: string | null; // Base64-encoded sha256 hash of content referenced by the `media` field. Required if `media` is included.
  copies: number | null; // number of copies of this set of metadata in existence when token was minted.
  issued_at: number | null; // When token was issued or minted, Unix epoch in milliseconds
  expires_at: number | null; // When token expires, Unix epoch in milliseconds
  starts_at: number | null; // When token starts being valid, Unix epoch in milliseconds
  updated_at: number | null; // When token was last updated, Unix epoch in milliseconds
  extra: string | null; // anything extra the NFT wants to store on-chain. Can be stringified JSON.
  reference: string | null; // URL to an off-chain JSON file with more info.
  reference_hash: string | null; // Base64-encoded sha256 hash of JSON from reference field. Required if `reference` is included.
};

type AccountNonFungibleToken = {
  tokenId: string;
  ownerId: string;
  authorAccountId: string;
  metadata: NFTMetadata;
  contractMetadata: Omit<
    NFTContractMetadata,
    "spec" | "reference" | "reference_hash" | "base_uri"
  >;
  index: number;
  totalNftCount: number;
};

type NFTMetadata = {
  title: string | null;
  description: string | null;
  media: string | null;
};

// copied from Wallet https://github.com/near/near-wallet/blob/master/packages/frontend/src/services/NonFungibleTokens.js#L95
const buildMediaUrl = (
  media: TokenMetadata["media"],
  base_uri: NFTContractMetadata["base_uri"]
) => {
  // return the provided media string if it is empty or already in a URI format
  if (!media || media.includes("://") || media.startsWith("data:image")) {
    return media;
  }

  if (base_uri) {
    return `${base_uri}/${media}`;
  }

  return `https://cloudflare-ipfs.com/ipfs/${media}`;
};

export const router = trpc
  .router<Context>()
  .query("contract-list", {
    input: z.strictObject({ accountId: validators.accountId }),
    resolve: async ({ input: { accountId } }) => {
      const selection = await indexerDatabase
        .selectFrom("assets__non_fungible_token_events")
        .select("emitted_by_contract_account_id as contractId")
        .distinctOn("emitted_by_contract_account_id")
        .where("token_new_owner_account_id", "=", accountId)
        .execute();
      return selection.map((row) => row.contractId);
    },
  })
  .query("tokens-list", {
    input: z.strictObject({
      contractId: z.string(),
      accountId: validators.accountId,
      limit: validators.limit,
      cursor: z.number().optional(),
    }),
    resolve: async ({ input: { contractId, accountId, limit, cursor = 0 } }) => {
      const nonFungibleTokenCount: string = await nearApi.callViewMethod(
        contractId,
        "nft_supply_for_owner",
        {
          account_id: accountId,
        }
      );
      const nonFungibleTokenContractMetadata: NFTContractMetadata =
        await nearApi.callViewMethod(contractId, "nft_metadata", {});

      const nonFungibleTokenMetadata: Token[] = await nearApi.callViewMethod(
        contractId,
        "nft_tokens_for_owner",
        {
          account_id: accountId,
          from_index: cursor.toString(),
          limit,
        }
      );

      return nonFungibleTokenMetadata.map((token, index) => ({
        tokenId: token.token_id,
        ownerId: token.owner_id,
        authorAccountId: contractId,
        metadata: {
          title: token.metadata.title || null,
          description: token.metadata.description || null,
          media: token.metadata.media
            ? buildMediaUrl(
                token.metadata.media,
                nonFungibleTokenContractMetadata.base_uri
              )
            : null,
        },
        contractMetadata: {
          name: nonFungibleTokenContractMetadata.name,
          symbol: nonFungibleTokenContractMetadata.symbol,
          icon: nonFungibleTokenContractMetadata.icon,
        },
        index: cursor + index,
        totalNftCount: parseInt(nonFungibleTokenCount ?? 0),
      }));
    },
  })
  .query("token-history", {
    input: z.strictObject({
      tokenAuthorAccountId: z.string(),
      tokenId: z.string(),
    }),
    resolve: async ({ input: { tokenAuthorAccountId, tokenId } }) => {
      const selection = await indexerDatabase
        .selectFrom("assets__non_fungible_token_events")
        .innerJoin("receipts", (qb) =>
          qb.onRef("emitted_for_receipt_id", "=", "receipts.receipt_id")
        )
        .innerJoin("blocks", (qb) =>
          qb.onRef("blocks.block_hash", "=", "receipts.included_in_block_hash")
        )
        .select([
          "token_id as tokenId",
          "event_kind as eventKind",
          "token_old_owner_account_id as prevAccountId",
          "token_new_owner_account_id as nextAccountId",
          "emitted_for_receipt_id as receiptId",
          (eb) => div(eb, "emitted_at_block_timestamp", 1000 * 1000, "timestamp"),
          "originated_from_transaction_hash as transactionHash",
          "block_height as blockHeight",
        ])
        .where("emitted_by_contract_account_id", "=", tokenAuthorAccountId)
        .where("token_id", "=", tokenId)
        .orderBy("emitted_at_block_timestamp", "desc")
        .orderBy("emitted_in_shard_id", "desc")
        .orderBy("emitted_index_of_event_entry_in_shard", "desc")
        // Pagination to be introduced soon..
        .limit(200)
        .execute();
      return selection.map((element) => ({
        prevAccountId: element.prevAccountId,
        nextAccountId: element.nextAccountId,
        eventKind: element.eventKind,
        tokenId: element.tokenId,
        transactionHash: element.transactionHash,
        receiptId: element.receiptId,
        timestamp: parseInt(element.timestamp),
      }));
    },
  });
