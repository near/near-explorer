// @generated
// Automatically generated. Don't change this file manually.

export default interface BalanceChanges {
  /** Primary key. Index: balance_changes_pkey */
  block_timestamp: string;

  receipt_id: string | null;

  transaction_hash: string | null;

  /** Index: balance_changes_affected_account_idx */
  affected_account_id: string;

  involved_account_id: string | null;

  direction: string;

  cause: string;

  status: string;

  delta_nonstaked_amount: string;

  absolute_nonstaked_amount: string;

  delta_staked_amount: string;

  absolute_staked_amount: string;

  /** Primary key. Index: balance_changes_pkey */
  shard_id: number;

  /** Primary key. Index: balance_changes_pkey */
  index_in_chunk: number;
}

export interface BalanceChangesInitializer {
  /** Primary key. Index: balance_changes_pkey */
  block_timestamp: string;

  receipt_id?: string | null;

  transaction_hash?: string | null;

  /** Index: balance_changes_affected_account_idx */
  affected_account_id: string;

  involved_account_id?: string | null;

  direction: string;

  cause: string;

  status: string;

  delta_nonstaked_amount: string;

  absolute_nonstaked_amount: string;

  delta_staked_amount: string;

  absolute_staked_amount: string;

  /** Primary key. Index: balance_changes_pkey */
  shard_id: number;

  /** Primary key. Index: balance_changes_pkey */
  index_in_chunk: number;
}
