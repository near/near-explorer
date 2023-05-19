import { stringify } from "querystring";

type Api = {
  FT: {
    balances: {
      input?: Partial<{
        block_height: number;
        block_timestamp_nanos: string;
        limit: number;
      }>;
      output: {
        balances: [
          {
            amount: string;
            contract_account_id: string;
            metadata: {
              decimals: number;
              icon: string;
              name: string;
              symbol: string;
            };
          }
        ];
        block_height: string;
        block_timestamp_nanos: string;
      };
    };
    balanceByContract: {
      input?: Partial<{
        block_height: number;
        block_timestamp_nanos: string;
      }>;
      output: {
        balance: {
          amount: string;
          contract_account_id: string;
          metadata: {
            decimals: number;
            icon: string;
            name: string;
            symbol: string;
          };
        };
        block_height: string;
        block_timestamp_nanos: string;
      };
    };
    historyByContract: {
      input?: Partial<{
        after_event_index: number;
        limit: number;
      }>;
      output: {
        block_height: string;
        block_timestamp_nanos: string;
        history: {
          block_height: string;
          block_timestamp_nanos: string;
          cause: string;
          new_account_id: string;
          old_account_id: string;
          status: string;
        }[];
        nft: {
          metadata: {
            copies: number;
            description: string;
            extra: string;
            media: string;
            media_hash: string;
            reference: string;
            reference_hash: string;
            title: string;
          };
          owner_account_id: string;
          token_id: string;
        };
      };
    };
    metadata: {
      input?: Partial<{
        block_height: number;
        block_timestamp_nanos: string;
      }>;
      output: {
        block_height: string;
        block_timestamp_nanos: string;
        metadata: {
          decimals: number;
          icon: string;
          name: string;
          reference: string;
          reference_hash: string;
          spec: string;
          symbol: string;
        };
      };
    };
  };

  NFT: {
    get: {
      input?: Partial<{
        block_height: number;
        block_timestamp_nanos: string;
      }>;
      output: {
        block_height: string;
        block_timestamp_nanos: string;
        contract_metadata: {
          base_uri: string;
          icon: string;
          name: string;
          reference: string;
          reference_hash: string;
          spec: string;
          symbol: string;
        };
        nft: {
          metadata: {
            copies: number;
            description: string;
            extra: string;
            media: string;
            media_hash: string;
            reference: string;
            reference_hash: string;
            title: string;
          };
          owner_account_id: string;
          token_id: string;
        };
      };
    };
    history: {
      input?: Partial<{
        limit: number;
      }>;
      output: {
        block_height: string;
        block_timestamp_nanos: string;
        contract_metadata: {
          base_uri: string;
          icon: string;
          name: string;
          reference: string;
          reference_hash: string;
          spec: string;
          symbol: string;
        };
        nft: {
          metadata: {
            copies: number;
            description: string;
            extra: string;
            media: string;
            media_hash: string;
            reference: string;
            reference_hash: string;
            title: string;
          };
          owner_account_id: string;
          token_id: string;
        };
      };
    };
    collection: {
      input?: Partial<{
        limit: number;
      }>;
      output: {
        block_height: string;
        block_timestamp_nanos: string;
        nft_counts: [
          {
            contract_account_id: string;
            contract_metadata: {
              base_uri: string;
              icon: string;
              name: string;
              reference: string;
              reference_hash: string;
              spec: string;
              symbol: string;
            };
            last_updated_at_timestamp_nanos: string;
            nft_count: number;
          }
        ];
      };
    };
    collectionByContract: {
      input?: Partial<{
        limit: number;
      }>;
      output: {
        block_height: string;
        block_timestamp_nanos: string;
        contract_metadata: {
          base_uri: string;
          icon: string;
          name: string;
          reference: string;
          reference_hash: string;
          spec: string;
          symbol: string;
        };
        nfts: [
          {
            metadata: {
              copies: number;
              description: string;
              extra: string;
              media: string;
              media_hash: string;
              reference: string;
              reference_hash: string;
              title: string;
            };
            owner_account_id: string;
            token_id: string;
          }
        ];
      };
    };
    contractMetadata: {
      input?: Partial<{
        block_height: string;
        block_timestamp_nanos: string;
      }>;
      output: {
        block_height: string;
        block_timestamp_nanos: string;
        metadata: {
          base_uri: string;
          icon: string;
          name: string;
          reference: string;
          reference_hash: string;
          spec: string;
          symbol: string;
        };
      };
    };
  };
};

type Input<
  Section extends keyof Api & string,
  Method extends keyof Api[Section] & string
> = Api[Section][Method] extends { input?: unknown }
  ? Api[Section][Method]["input"]
  : never;

type Output<
  Section extends keyof Api & string,
  Method extends keyof Api[Section] & string
> = Api[Section][Method] extends { output?: unknown }
  ? Api[Section][Method]["output"]
  : never;

const runApi = async <
  Section extends keyof Api & string,
  Method extends keyof Api[Section] & string
>(
  ...[path, input]: undefined extends Input<Section, Method>
    ? [path: string, input?: Input<Section, Method>]
    : [path: string, input: Input<Section, Method>]
): Promise<Output<Section, Method>> => {
  const response = await fetch(
    `${process.env.ENHANCED_API_ENDPOINT}/${path}${
      input ? `?${stringify(input)}` : ""
    }`,
    {
      headers: new Headers({
        "Content-Type": "application/json",
        "x-api-key": process.env.ENHANCED_API_KEY || "unknown",
      }),
      body: input ? JSON.stringify(input) : undefined,
    }
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const json = await response.json();
  return json;
};

export const enhancedApi = {
  FT: {
    balances: (accountId: string, opts?: Input<"FT", "balances">) =>
      runApi<"FT", "balances">(`/accounts/${accountId}/balances/FT`, opts),
    balanceByContract: (
      accountId: string,
      contractId: string,
      opts?: Input<"FT", "balanceByContract">
    ) =>
      runApi<"FT", "balanceByContract">(
        `/accounts/${accountId}/balances/FT/${contractId}`,
        opts
      ),
    historyByContract: (
      accountId: string,
      contractId: string,
      opts?: Input<"FT", "historyByContract">
    ) =>
      runApi<"FT", "historyByContract">(
        `/accounts/${accountId}/balances/FT/${contractId}/history`,
        opts
      ),
    metadata: (contractId: string, opts?: Input<"FT", "historyByContract">) =>
      runApi<"FT", "historyByContract">(`/nep141/metadata/${contractId}`, opts),
  },
  NFT: {
    get: (contractId: string, tokenId: string, opts?: Input<"NFT", "get">) =>
      runApi<"NFT", "get">(`/NFT/${contractId}/${tokenId}`, opts),
    history: (
      contractId: string,
      tokenId: string,
      opts?: Input<"NFT", "history">
    ) =>
      runApi<"NFT", "history">(`/NFT/${contractId}/${tokenId}/history`, opts),
    collection: (accountId: string, opts?: Input<"NFT", "collection">) =>
      runApi<"NFT", "collection">(`/accounts/${accountId}/NFT`, opts),
    collectionByContract: (
      accountId: string,
      contractId: string,
      opts?: Input<"NFT", "collectionByContract">
    ) =>
      runApi<"NFT", "collectionByContract">(
        `/accounts/${accountId}/NFT/${contractId}`,
        opts
      ),
    contractMetadata: (
      contractId: string,
      opts?: Input<"NFT", "contractMetadata">
    ) =>
      runApi<"NFT", "contractMetadata">(`/nep171/metadata/${contractId}`, opts),
  },
};
