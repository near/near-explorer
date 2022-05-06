// @generated
// Automatically generated. Don't change this file manually.

import { ReceiptsId } from "./receipts";
import ActionKind from "./action-kind";

export default interface ActionReceiptActions {
  /** Primary key. Index: receipt_action_action_pk */
  receipt_id: ReceiptsId;

  /** Primary key. Index: receipt_action_action_pk */
  index_in_action_receipt: number;

  /** Index: action_receipt_actions_action_kind_idx */
  action_kind: ActionKind;

  args: Record<string, unknown>;

  /** Index: action_receipt_actions_receipt_predecessor_account_id_idx */
  receipt_predecessor_account_id: string;

  /**
   * Index: action_receipt_actions_receipt_receiver_account_id_idx
   * Index: action_receipt_actions_receiver_and_timestamp_idx
   */
  receipt_receiver_account_id: string;

  /**
   * Index: action_receipt_actions_receipt_included_in_block_timestamp_idx
   * Index: action_receipt_actions_receiver_and_timestamp_idx
   */
  receipt_included_in_block_timestamp: string;
}

export interface ActionReceiptActionsInitializer {
  /** Primary key. Index: receipt_action_action_pk */
  receipt_id: ReceiptsId;

  /** Primary key. Index: receipt_action_action_pk */
  index_in_action_receipt: number;

  /** Index: action_receipt_actions_action_kind_idx */
  action_kind: ActionKind;

  args: Record<string, unknown>;

  /** Index: action_receipt_actions_receipt_predecessor_account_id_idx */
  receipt_predecessor_account_id: string;

  /**
   * Index: action_receipt_actions_receipt_receiver_account_id_idx
   * Index: action_receipt_actions_receiver_and_timestamp_idx
   */
  receipt_receiver_account_id: string;

  /**
   * Index: action_receipt_actions_receipt_included_in_block_timestamp_idx
   * Index: action_receipt_actions_receiver_and_timestamp_idx
   */
  receipt_included_in_block_timestamp: string;
}
