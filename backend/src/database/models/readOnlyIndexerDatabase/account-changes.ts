// @generated
// Automatically generated. Don't change this file manually.

import { AccountsId } from "./accounts";
import { BlocksId } from "./blocks";
import { TransactionsId } from "./transactions";
import { ReceiptsId } from "./receipts";
import StateChangeReasonKind from "./state-change-reason-kind";

export type AccountChangesId = string & { " __flavor"?: "account_changes" };

export default interface AccountChanges {
  /** Primary key. Index: account_changes_pkey */
  id: AccountChangesId;

  /**
   * Index: account_changes_affected_account_id_idx
   * Index: account_changes_null_uni_idx
   * Index: account_changes_receipt_uni_idx
   * Index: account_changes_transaction_uni_idx
   */
  affected_account_id: AccountsId;

  /**
   * Index: account_changes_changed_in_block_timestamp_idx
   * Index: account_changes_sorting_idx
   */
  changed_in_block_timestamp: string;

  /**
   * Index: account_changes_changed_in_block_hash_idx
   * Index: account_changes_null_uni_idx
   * Index: account_changes_receipt_uni_idx
   * Index: account_changes_transaction_uni_idx
   */
  changed_in_block_hash: BlocksId;

  /**
   * Index: account_changes_changed_in_caused_by_transaction_hash_idx
   * Index: account_changes_transaction_uni_idx
   */
  caused_by_transaction_hash: TransactionsId | null;

  /**
   * Index: account_changes_changed_in_caused_by_receipt_id_idx
   * Index: account_changes_receipt_uni_idx
   */
  caused_by_receipt_id: ReceiptsId | null;

  /**
   * Index: account_changes_null_uni_idx
   * Index: account_changes_receipt_uni_idx
   * Index: account_changes_transaction_uni_idx
   */
  update_reason: StateChangeReasonKind;

  /**
   * Index: account_changes_null_uni_idx
   * Index: account_changes_receipt_uni_idx
   * Index: account_changes_transaction_uni_idx
   */
  affected_account_nonstaked_balance: string;

  /**
   * Index: account_changes_null_uni_idx
   * Index: account_changes_receipt_uni_idx
   * Index: account_changes_transaction_uni_idx
   */
  affected_account_staked_balance: string;

  /**
   * Index: account_changes_null_uni_idx
   * Index: account_changes_receipt_uni_idx
   * Index: account_changes_transaction_uni_idx
   */
  affected_account_storage_usage: string;

  /** Index: account_changes_sorting_idx */
  index_in_block: number;
}

export interface AccountChangesInitializer {
  /**
   * Default value: nextval('account_changes_new_id_seq'::regclass)
   * Primary key. Index: account_changes_pkey
   */
  id?: AccountChangesId;

  /**
   * Index: account_changes_affected_account_id_idx
   * Index: account_changes_null_uni_idx
   * Index: account_changes_receipt_uni_idx
   * Index: account_changes_transaction_uni_idx
   */
  affected_account_id: AccountsId;

  /**
   * Index: account_changes_changed_in_block_timestamp_idx
   * Index: account_changes_sorting_idx
   */
  changed_in_block_timestamp: string;

  /**
   * Index: account_changes_changed_in_block_hash_idx
   * Index: account_changes_null_uni_idx
   * Index: account_changes_receipt_uni_idx
   * Index: account_changes_transaction_uni_idx
   */
  changed_in_block_hash: BlocksId;

  /**
   * Index: account_changes_changed_in_caused_by_transaction_hash_idx
   * Index: account_changes_transaction_uni_idx
   */
  caused_by_transaction_hash?: TransactionsId | null;

  /**
   * Index: account_changes_changed_in_caused_by_receipt_id_idx
   * Index: account_changes_receipt_uni_idx
   */
  caused_by_receipt_id?: ReceiptsId | null;

  /**
   * Index: account_changes_null_uni_idx
   * Index: account_changes_receipt_uni_idx
   * Index: account_changes_transaction_uni_idx
   */
  update_reason: StateChangeReasonKind;

  /**
   * Index: account_changes_null_uni_idx
   * Index: account_changes_receipt_uni_idx
   * Index: account_changes_transaction_uni_idx
   */
  affected_account_nonstaked_balance: string;

  /**
   * Index: account_changes_null_uni_idx
   * Index: account_changes_receipt_uni_idx
   * Index: account_changes_transaction_uni_idx
   */
  affected_account_staked_balance: string;

  /**
   * Index: account_changes_null_uni_idx
   * Index: account_changes_receipt_uni_idx
   * Index: account_changes_transaction_uni_idx
   */
  affected_account_storage_usage: string;

  /** Index: account_changes_sorting_idx */
  index_in_block: number;
}
