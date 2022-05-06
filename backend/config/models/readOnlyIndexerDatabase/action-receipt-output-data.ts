// @generated
// Automatically generated. Don't change this file manually.

import { ReceiptsId } from "./receipts";

export default interface ActionReceiptOutputData {
  /**
   * Primary key. Index: action_output_pk
   * Index: action_receipt_output_data_output_data_id_idx
   */
  output_data_id: string;

  /**
   * Primary key. Index: action_output_pk
   * Index: action_receipt_output_data_output_from_receipt_id_idx
   */
  output_from_receipt_id: ReceiptsId;

  /** Index: action_receipt_output_data_receiver_account_id_idx */
  receiver_account_id: string;
}

export interface ActionReceiptOutputDataInitializer {
  /**
   * Primary key. Index: action_output_pk
   * Index: action_receipt_output_data_output_data_id_idx
   */
  output_data_id: string;

  /**
   * Primary key. Index: action_output_pk
   * Index: action_receipt_output_data_output_from_receipt_id_idx
   */
  output_from_receipt_id: ReceiptsId;

  /** Index: action_receipt_output_data_receiver_account_id_idx */
  receiver_account_id: string;
}
