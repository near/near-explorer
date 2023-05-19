import * as trpc from "@trpc/server";
import { z } from "zod";

import { RequestContext } from "@/backend/context";
import { enhancedApi } from "@/backend/providers/enhanced-api";
import { validateBase64Image } from "@/backend/router/account/fungible-tokens";
import { validators } from "@/backend/router/validators";

// copied from Wallet https://github.com/near/near-wallet/blob/master/packages/frontend/src/services/NonFungibleTokens.js#L95
const buildMediaUrl = (media: string, baseUri: string) => {
  // return the provided media string if it is empty or already in a URI format
  if (!media || media.includes("://") || media.startsWith("data:image")) {
    return media;
  }

  if (baseUri) {
    return `${baseUri}/${media}`;
  }

  return `https://cloudflare-ipfs.com/ipfs/${media}`;
};

export const router = trpc
  .router<RequestContext>()
  .query("nonFungibleTokenContracts", {
    input: z.strictObject({ accountId: validators.accountId }),
    resolve: async ({ input: { accountId } }) => {
      const collection = await enhancedApi.NFT.collection(accountId);
      return collection.nft_counts.map(
        ({ contract_account_id }) => contract_account_id
      );
    },
  })
  .query("nonFungibleTokens", {
    input: z.strictObject({
      contractId: validators.accountId,
      accountId: validators.accountId,
      limit: validators.limit,
      cursor: z.number().optional(),
    }),
    resolve: async ({
      input: { contractId, accountId, limit, cursor = 0 },
    }) => {
      const [collection, contract] = await Promise.all([
        enhancedApi.NFT.collectionByContract(accountId, contractId, {
          limit,
        }),
        enhancedApi.NFT.contractMetadata(contractId),
      ]);
      const items = collection.nfts.map((nft, index) => ({
        tokenId: nft.token_id,
        ownerId: nft.owner_account_id,
        authorAccountId: contractId,
        metadata: {
          title: nft.metadata.title,
          description: nft.metadata.description || null,
          media: nft.metadata.media
            ? buildMediaUrl(nft.metadata.media, contract.metadata.base_uri)
            : null,
        },
        contractMetadata: {
          name: contract.metadata.name,
          symbol: contract.metadata.symbol,
          icon: validateBase64Image(contract.metadata.icon),
        },
        index: cursor + index,
      }));
      const lastItem = items.at(-1);
      return {
        items,
        cursor: lastItem ? lastItem.index + 1 : undefined,
      };
    },
  })
  .query("nonFungibleTokensCount", {
    input: z.strictObject({ accountId: validators.accountId }),
    resolve: async ({ input: { accountId } }) => {
      const collection = await enhancedApi.NFT.collection(accountId);
      return collection.nft_counts.reduce(
        (acc, { nft_count }) => acc + nft_count,
        0
      );
    },
  })
  .query("nonFungibleTokenHistory", {
    input: z.strictObject({
      tokenAuthorAccountId: validators.accountId,
      tokenId: validators.nonFungibleTokenId,
    }),
    resolve: async ({ input: { tokenAuthorAccountId, tokenId } }) => {
      const history = await enhancedApi.NFT.history(
        tokenAuthorAccountId,
        tokenId
      );
      return [history.nft].map((element) => ({
        prevAccountId: element.owner_account_id,
        nextAccountId: element.owner_account_id,
        eventKind: "unknown",
        tokenId: element.token_id,
        transactionHash: "unknown",
        receiptId: "unknown",
        timestamp: "unknown",
      }));
    },
  });
