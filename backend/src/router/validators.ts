import { z } from "zod";

export const validators = {
  transactionPagination: z.strictObject({
    endTimestamp: z.number().positive(),
    transactionIndex: z.number().gte(0),
  }),
  accountPagination: z.number(),
  accountActivityCursor: z.strictObject({
    blockTimestamp: z.string(),
    shardId: z.number(),
    indexInChunk: z.number(),
  }),
  blockPagination: z.number(),
  accountId: z.string(),
  blockHash: z.string(),
  blockId: z.union([z.string(), z.number()]),
  receiptId: z.string(),
  transactionHash: z.string(),
  limit: z.number().positive(),
  telemetryRequest: z.object({
    ip_address: z.string(),
    signature: z.string().optional(),
    agent: z.object({
      name: z.string(),
      version: z.string(),
      build: z.string(),
    }),
    chain: z.object({
      node_id: z.string(),
      account_id: z.string().nullish(),
      latest_block_height: z.number(),
      num_peers: z.number(),
      is_validator: z.boolean(),
      latest_block_hash: z.string(),
      status: z.string(),
    }),
  }),
};
