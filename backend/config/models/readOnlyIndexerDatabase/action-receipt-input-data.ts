// @generated
// Automatically generated. Don't change this file manually.

import { ReceiptsId } from "./receipts";

export default interface ActionReceiptInputData {
  /**
   * Primary key. Index: action_input_pk
   * Index: action_receipt_input_data_input_data_id_idx
   */
  input_data_id: string;

  /**
   * Primary key. Index: action_input_pk
   * Index: action_receipt_input_data_input_to_receipt_id_idx
   */
  input_to_receipt_id: ReceiptsId;
}

export interface ActionReceiptInputDataInitializer {
  /**
   * Primary key. Index: action_input_pk
   * Index: action_receipt_input_data_input_data_id_idx
   */
  input_data_id: string;

  /**
   * Primary key. Index: action_input_pk
   * Index: action_receipt_input_data_input_to_receipt_id_idx
   */
  input_to_receipt_id: ReceiptsId;
}
