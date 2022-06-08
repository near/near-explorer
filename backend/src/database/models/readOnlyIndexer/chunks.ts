// @generated
// Automatically generated. Don't change this file manually.

import { BlocksId } from "./blocks";

export type ChunksId = string & { " __flavor"?: "chunks" };

export default interface Chunks {
  /** Index: chunks_included_in_block_hash_idx */
  included_in_block_hash: BlocksId;

  /** Primary key. Index: chunks_pkey */
  chunk_hash: ChunksId;

  shard_id: string;

  signature: string;

  gas_limit: string;

  gas_used: string;

  author_account_id: string;
}

export interface ChunksInitializer {
  /** Index: chunks_included_in_block_hash_idx */
  included_in_block_hash: BlocksId;

  /** Primary key. Index: chunks_pkey */
  chunk_hash: ChunksId;

  shard_id: string;

  signature: string;

  gas_limit: string;

  gas_used: string;

  author_account_id: string;
}
