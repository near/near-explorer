import { z } from "zod";

export const validators = {
  transactionPagination: z.strictObject({
    timestamp: z.string(),
    indexInChunk: z.number().gte(0),
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
    ipAddress: z.string(),
    signature: z.string().optional(),
    agent: z.object({
      name: z.string(),
      version: z.string(),
      build: z.string(),
    }),
    system: z.object({
      bandwidth_download: z.number(),
      bandwidth_upload: z.number(),
      cpu_usage: z.number(),
      memory_usage: z.number(),
      boot_time_seconds: z.number().optional(),
    }),
    chain: z.object({
      node_id: z.string(),
      account_id: z.string().nullish(),
      latest_block_height: z.number(),
      num_peers: z.number(),
      is_validator: z.boolean(),
      latest_block_hash: z.string(),
      status: z.string(),

      block_production_tracking_delay: z.number().optional(),
      min_block_production_delay: z.number().optional(),
      max_block_production_delay: z.number().optional(),
      max_block_wait_delay: z.number().optional(),
    }),
  }),
};
