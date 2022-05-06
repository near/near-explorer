// @generated
// Automatically generated. Don't change this file manually.

import { BlocksId } from "./blocks";
import { ChunksId } from "./chunks";
import { TransactionsId } from "./transactions";
import ReceiptKind from "./receipt-kind";

export type ReceiptsId = string & { " __flavor"?: "receipts" };

export default interface Receipts {
  /** Primary key. Index: receipts_pkey */
  receipt_id: ReceiptsId;

  /** Index: receipts_included_in_block_hash_idx */
  included_in_block_hash: BlocksId;

  /** Index: receipts_included_in_chunk_hash_idx */
  included_in_chunk_hash: ChunksId;

  index_in_chunk: number;

  /** Index: receipts_timestamp_idx */
  included_in_block_timestamp: string;

  /** Index: receipts_predecessor_account_id_idx */
  predecessor_account_id: string;

  /** Index: receipts_receiver_account_id_idx */
  receiver_account_id: string;

  receipt_kind: ReceiptKind;

  /** Index: receipts_originated_from_transaction_hash_idx */
  originated_from_transaction_hash: TransactionsId;
}

export interface ReceiptsInitializer {
  /** Primary key. Index: receipts_pkey */
  receipt_id: ReceiptsId;

  /** Index: receipts_included_in_block_hash_idx */
  included_in_block_hash: BlocksId;

  /** Index: receipts_included_in_chunk_hash_idx */
  included_in_chunk_hash: ChunksId;

  index_in_chunk: number;

  /** Index: receipts_timestamp_idx */
  included_in_block_timestamp: string;

  /** Index: receipts_predecessor_account_id_idx */
  predecessor_account_id: string;

  /** Index: receipts_receiver_account_id_idx */
  receiver_account_id: string;

  receipt_kind: ReceiptKind;

  /** Index: receipts_originated_from_transaction_hash_idx */
  originated_from_transaction_hash: TransactionsId;
}
