// @generated
// Automatically generated. Don't change this file manually.

import { BlocksId } from "./blocks";
import { ChunksId } from "./chunks";
import ExecutionOutcomeStatus from "./execution-outcome-status";

export type TransactionsId = string & { " __flavor"?: "transactions" };

export default interface Transactions {
  /** Primary key. Index: transactions_pkey */
  transaction_hash: TransactionsId;

  /** Index: transactions_included_in_block_hash_idx */
  included_in_block_hash: BlocksId;

  /** Index: transactions_included_in_chunk_hash_idx */
  included_in_chunk_hash: ChunksId;

  /** Index: transactions_sorting_idx */
  index_in_chunk: number;

  /**
   * Index: transactions_included_in_block_timestamp_idx
   * Index: transactions_sorting_idx
   */
  block_timestamp: string;

  /** Index: transactions_signer_account_id_idx */
  signer_account_id: string;

  /** Index: transactions_signer_public_key_idx */
  signer_public_key: string;

  nonce: string;

  /** Index: transactions_receiver_account_id_idx */
  receiver_account_id: string;

  signature: string;

  status: ExecutionOutcomeStatus;

  /** Index: transactions_converted_into_receipt_id_dx */
  converted_into_receipt_id: string;

  receipt_conversion_gas_burnt: string | null;

  receipt_conversion_tokens_burnt: string | null;
}

export interface TransactionsInitializer {
  /** Primary key. Index: transactions_pkey */
  transaction_hash: TransactionsId;

  /** Index: transactions_included_in_block_hash_idx */
  included_in_block_hash: BlocksId;

  /** Index: transactions_included_in_chunk_hash_idx */
  included_in_chunk_hash: ChunksId;

  /** Index: transactions_sorting_idx */
  index_in_chunk: number;

  /**
   * Index: transactions_included_in_block_timestamp_idx
   * Index: transactions_sorting_idx
   */
  block_timestamp: string;

  /** Index: transactions_signer_account_id_idx */
  signer_account_id: string;

  /** Index: transactions_signer_public_key_idx */
  signer_public_key: string;

  nonce: string;

  /** Index: transactions_receiver_account_id_idx */
  receiver_account_id: string;

  signature: string;

  status: ExecutionOutcomeStatus;

  /** Index: transactions_converted_into_receipt_id_dx */
  converted_into_receipt_id: string;

  receipt_conversion_gas_burnt?: string | null;

  receipt_conversion_tokens_burnt?: string | null;
}
