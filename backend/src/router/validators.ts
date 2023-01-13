import { z } from "zod";

const accountId = z
  .string()
  .min(2)
  .max(64)
  .regex(/^(([a-z\d]+[\-_])*[a-z\d]+\.)*([a-z\d]+[\-_])*[a-z\d]+$/);
const nonFungibleTokenId = z.string();

const blockHash = z.string().min(43).max(44);
const blockHeight = z.number();

const receiptId = z.string();
const transactionHash = z.string();

const nanoTimestamp = z.string();
const milliTimestamp = z.number();

const indexInChunk = z.number().gte(0);
const shardId = z.number().gte(0);

const limit = z.number().positive();

export const validators = {
  transactionPagination: z.strictObject({
    timestamp: nanoTimestamp,
    indexInChunk,
  }),
  accountPagination: z.number(),
  accountActivityCursor: z.strictObject({
    blockTimestamp: nanoTimestamp,
    shardId,
    indexInChunk,
  }),
  blockPagination: milliTimestamp,
  accountId,
  blockHash,
  blockHeight,
  blockId: z.union([blockHash, blockHeight]),
  receiptId,
  transactionHash,
  nonFungibleTokenId,
  limit,
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
      account_id: accountId.nullish(),
      latest_block_height: blockHeight,
      num_peers: z.number(),
      is_validator: z.boolean(),
      latest_block_hash: blockHash,
      status: z.string(),

      block_production_tracking_delay: z.number().optional(),
      min_block_production_delay: z.number().optional(),
      max_block_production_delay: z.number().optional(),
      max_block_wait_delay: z.number().optional(),
    }),
  }),
};
