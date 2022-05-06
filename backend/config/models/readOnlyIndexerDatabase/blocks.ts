// @generated
// Automatically generated. Don't change this file manually.

export type BlocksId = string & { " __flavor"?: "blocks" };

export default interface Blocks {
  /** Index: blocks_height_idx */
  block_height: string;

  /** Primary key. Index: blocks_pkey */
  block_hash: BlocksId;

  /** Index: blocks_prev_hash_idx */
  prev_block_hash: string;

  /** Index: blocks_timestamp_idx */
  block_timestamp: string;

  total_supply: string;

  gas_price: string;

  author_account_id: string;
}

export interface BlocksInitializer {
  /** Index: blocks_height_idx */
  block_height: string;

  /** Primary key. Index: blocks_pkey */
  block_hash: BlocksId;

  /** Index: blocks_prev_hash_idx */
  prev_block_hash: string;

  /** Index: blocks_timestamp_idx */
  block_timestamp: string;

  total_supply: string;

  gas_price: string;

  author_account_id: string;
}
